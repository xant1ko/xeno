import { BadRequestException, Controller, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { OperationsService } from '../operations/operations.service';
import { CsvImportResponseDto } from './dto/csv-import-response.dto';
import { CsvImportResult } from './types/csv-row.type';
import { CsvImportService } from './csv-import.service';

@ApiTags('csv-import')
@ApiCookieAuth('xeno_access_token')
@UseGuards(JwtAuthGuard)
@Controller('csv-import')
export class CsvImportController {
  constructor(
    private readonly csvImportService: CsvImportService,
    private readonly operationsService: OperationsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Распарсить CSV-файл и сохранить новые операции' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'CSV-файл размером до 5 MB.' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: CsvImportResponseDto, description: 'CSV преобразован, новые операции сохранены.' })
  @ApiResponse({ status: 400, description: 'Файл отсутствует или имеет некорректный CSV-формат.' })
  @ApiResponse({ status: 413, description: 'Файл превышает ограничение размера.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  async parseCsv(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      fileIsRequired: true,
      exceptionFactory: () => new BadRequestException('CSV-файл не передан'),
    })) file: Express.Multer.File,
  ): Promise<CsvImportResponseDto> {
    const result: CsvImportResult = this.csvImportService.parseFile(file);
    const saved = await this.operationsService.createMany(user, {
      operations: result.rows.map(operation => ({
        ...operation,
        date: operation.date.toISOString(),
      })),
    });
    return {
      filename: file.originalname,
      total: result.rows.length + result.errors.length,
      success: result.rows.length,
      failed: result.errors.length,
      rows: result.rows,
      errors: result.errors,
      saved,
    };
  }
}

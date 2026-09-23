import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { CreateManyOperationsDto } from './dto/create-many-operations.dto';
import { CreateManyOperationsResponseDto } from './dto/create-many-response.dto';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationResponseDto, OperationsPageResponseDto } from './dto/operation-response.dto';
import { OperationsQueryDto } from './dto/operations-query.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { OperationsService } from './operations.service';

@ApiTags('operations')
@ApiCookieAuth('xeno_access_token')
@UseGuards(JwtAuthGuard)
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать операцию' })
  @ApiCreatedResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные данные операции.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOperationDto): Promise<OperationResponseDto> {
    return this.operationsService.create(user, dto);
  }

  @Post('create-many')
  @ApiOperation({ summary: 'Создать только операции новее последней сохранённой' })
  @ApiCreatedResponse({ type: CreateManyOperationsResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный массив операций.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  createMany(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateManyOperationsDto): Promise<CreateManyOperationsResponseDto> {
    return this.operationsService.createMany(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список операций' })
  @ApiOkResponse({ type: OperationsPageResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные параметры выборки.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: OperationsQueryDto): Promise<OperationsPageResponseDto> {
    return this.operationsService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить операцию по идентификатору' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<OperationResponseDto> {
    return this.operationsService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить операцию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор или данные операции.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateOperationDto): Promise<OperationResponseDto> {
    return this.operationsService.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить операцию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiNoContentResponse({ description: 'Операция удалена.' })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    return this.operationsService.remove(user, id);
  }
}

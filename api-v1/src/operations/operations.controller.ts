import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManyOperationsDto } from './dto/create-many-operations.dto';
import { CreateManyOperationsResponseDto } from './dto/create-many-response.dto';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationResponseDto, OperationsPageResponseDto } from './dto/operation-response.dto';
import { OperationsQueryDto } from './dto/operations-query.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { OperationsService } from './operations.service';

@ApiTags('operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать операцию' })
  @ApiCreatedResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные данные операции.' })
  create(@Body() dto: CreateOperationDto): Promise<OperationResponseDto> {
    return this.operationsService.create(dto);
  }

  @Post('create-many')
  @ApiOperation({ summary: 'Создать только операции новее последней сохранённой' })
  @ApiCreatedResponse({ type: CreateManyOperationsResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный массив операций.' })
  createMany(@Body() dto: CreateManyOperationsDto): Promise<CreateManyOperationsResponseDto> {
    return this.operationsService.createMany(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список операций' })
  @ApiOkResponse({ type: OperationsPageResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные параметры выборки.' })
  findAll(@Query() query: OperationsQueryDto): Promise<OperationsPageResponseDto> {
    return this.operationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить операцию по идентификатору' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  findOne(@Param('id') id: string): Promise<OperationResponseDto> {
    return this.operationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить операцию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: OperationResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор или данные операции.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  update(@Param('id') id: string, @Body() dto: UpdateOperationDto): Promise<OperationResponseDto> {
    return this.operationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить операцию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiNoContentResponse({ description: 'Операция удалена.' })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Операция не найдена.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.operationsService.remove(id);
  }
}

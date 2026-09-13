import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreateManyOperationsDto } from './dto/create-many-operations.dto';
import { CreateManyOperationsResponseDto } from './dto/create-many-response.dto';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationResponseDto, OperationsPageResponseDto } from './dto/operation-response.dto';
import { OperationsQueryDto } from './dto/operations-query.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { OperationsRepository } from './operations.repository';
import { OperationDocument, OperationFields } from './types/operation.type';

@Injectable()
export class OperationsService {
  constructor(private readonly operationsRepository: OperationsRepository) {}

  async create(dto: CreateOperationDto): Promise<OperationResponseDto> {
    const operation = await this.operationsRepository.create(this.toFields(dto));
    return this.toResponse(operation);
  }

  async createMany(dto: CreateManyOperationsDto): Promise<CreateManyOperationsResponseDto> {
    const cutoffDate = await this.operationsRepository.findLatestDate();
    const newOperations = dto.operations
      .map(operation => this.toFields(operation))
      .filter(operation => cutoffDate === null || operation.date.getTime() > cutoffDate.getTime())
      .sort((left, right) => left.date.getTime() - right.date.getTime());
    const created = await this.operationsRepository.createMany(newOperations);

    return {
      received: dto.operations.length,
      created: created.length,
      skipped: dto.operations.length - created.length,
      cutoff_date: cutoffDate,
      operations: created.map(operation => this.toResponse(operation)),
    };
  }

  async findAll(query: OperationsQueryDto): Promise<OperationsPageResponseDto> {
    const result = await this.operationsRepository.findAll(query.page, query.limit);
    return {
      items: result.items.map(operation => this.toResponse(operation)),
      total: result.total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(id: string): Promise<OperationResponseDto> {
    const operation = await this.operationsRepository.findById(this.toObjectId(id));
    if (!operation) {
      throw new NotFoundException('Операция не найдена');
    }
    return this.toResponse(operation);
  }

  async update(id: string, dto: UpdateOperationDto): Promise<OperationResponseDto> {
    const { date, ...fields } = dto;
    const operation = await this.operationsRepository.updateById(this.toObjectId(id), {
      ...fields,
      ...(date === undefined ? {} : { date: new Date(date) }),
    });
    if (!operation) {
      throw new NotFoundException('Операция не найдена');
    }
    return this.toResponse(operation);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.operationsRepository.deleteById(this.toObjectId(id));
    if (!deleted) {
      throw new NotFoundException('Операция не найдена');
    }
  }

  private toFields(dto: CreateOperationDto): OperationFields {
    return {
      account_name: dto.account_name,
      card_number: dto.card_number,
      date: new Date(dto.date),
      transaction_amount: dto.transaction_amount,
      currency: dto.currency,
      status: dto.status,
      default_category: dto.default_category,
      custom_category: dto.custom_category,
      description: dto.description,
      message: dto.message,
    };
  }

  private toObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный идентификатор операции');
    }
    return new ObjectId(id);
  }

  private toResponse(operation: OperationDocument): OperationResponseDto {
    return {
      id: operation._id.toHexString(),
      account_name: operation.account_name,
      card_number: operation.card_number,
      date: operation.date,
      transaction_amount: operation.transaction_amount,
      currency: operation.currency,
      status: operation.status,
      default_category: operation.default_category,
      custom_category: operation.custom_category,
      description: operation.description,
      message: operation.message,
      created_at: operation.created_at,
      updated_at: operation.updated_at,
    };
  }
}

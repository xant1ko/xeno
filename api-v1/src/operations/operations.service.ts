import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthenticatedUser } from '../auth/types/auth.type';
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

  async create(user: AuthenticatedUser, dto: CreateOperationDto): Promise<OperationResponseDto> {
    const operation = await this.operationsRepository.create(this.toUserId(user), this.toFields(dto));
    return this.toResponse(operation);
  }

  async createMany(user: AuthenticatedUser, dto: CreateManyOperationsDto): Promise<CreateManyOperationsResponseDto> {
    const userId = this.toUserId(user);
    const cutoffDate = await this.operationsRepository.findLatestDate(userId);
    const newOperations = dto.operations
      .map(operation => this.toFields(operation))
      .filter(operation => cutoffDate === null || operation.date.getTime() > cutoffDate.getTime())
      .sort((left, right) => left.date.getTime() - right.date.getTime());
    const created = await this.operationsRepository.createMany(userId, newOperations);

    return {
      received: dto.operations.length,
      created: created.length,
      skipped: dto.operations.length - created.length,
      cutoff_date: cutoffDate,
      operations: created.map(operation => this.toResponse(operation)),
    };
  }

  async findAll(user: AuthenticatedUser, query: OperationsQueryDto): Promise<OperationsPageResponseDto> {
    const result = await this.operationsRepository.findAll(this.toUserId(user), query.page, query.limit, query.type);
    return {
      items: result.items.map(operation => this.toResponse(operation)),
      total: result.total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findOne(user: AuthenticatedUser, id: string): Promise<OperationResponseDto> {
    const operation = await this.operationsRepository.findById(this.toUserId(user), this.toObjectId(id));
    if (!operation) {
      throw new NotFoundException('Операция не найдена');
    }
    return this.toResponse(operation);
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateOperationDto): Promise<OperationResponseDto> {
    const { date, ...fields } = dto;
    const operation = await this.operationsRepository.updateById(this.toUserId(user), this.toObjectId(id), {
      ...fields,
      ...(date === undefined ? {} : { date: new Date(date) }),
    });
    if (!operation) {
      throw new NotFoundException('Операция не найдена');
    }
    return this.toResponse(operation);
  }

  async remove(user: AuthenticatedUser, id: string): Promise<void> {
    const deleted = await this.operationsRepository.deleteById(this.toUserId(user), this.toObjectId(id));
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

  private toUserId(user: AuthenticatedUser): ObjectId {
    return new ObjectId(user.id);
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

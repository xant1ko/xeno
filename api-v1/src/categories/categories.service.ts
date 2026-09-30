import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MongoServerError, ObjectId } from 'mongodb';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { OperationsRepository } from '../operations/operations.repository';
import { RecalculateCategoriesResponseDto } from './dto/recalculate-categories-response.dto';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly operationsRepository: OperationsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoriesRepository.create(this.toUserId(user), this.normalizeName(dto.name));
      return this.toResponse(category);
    } catch (error) {
      if (this.isDuplicateNameError(error)) {
        throw new ConflictException('Категория уже существует');
      }
      throw error;
    }
  }

  async findAll(user: AuthenticatedUser): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll(this.toUserId(user));
    return categories.map(category => this.toResponse(category));
  }

  async findOne(user: AuthenticatedUser, id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findById(this.toUserId(user), this.toObjectId(id));
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }
    return this.toResponse(category);
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const categoryId = this.toObjectId(id);
    if (dto.name === undefined) {
      return this.findOne(user, id);
    }

    try {
      const category = await this.categoriesRepository.updateById(
        this.toUserId(user),
        categoryId,
        this.normalizeName(dto.name),
      );
      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
      return this.toResponse(category);
    } catch (error) {
      if (this.isDuplicateNameError(error)) {
        throw new ConflictException('Категория уже существует');
      }
      throw error;
    }
  }

  async remove(user: AuthenticatedUser, id: string): Promise<void> {
    const deleted = await this.categoriesRepository.deleteById(this.toUserId(user), this.toObjectId(id));
    if (!deleted) {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async recalculate(user: AuthenticatedUser): Promise<RecalculateCategoriesResponseDto> {
    const operations = await this.operationsRepository.findAllForCategories(new ObjectId(user.id));
    const categories = new Map<string, true>();

    // Map гарантирует, что повторяющиеся категории попадут в базу только один раз.
    for (const operation of operations) {
      const category = (operation.custom_category || operation.default_category).trim();
      if (category) {
        categories.set(category, true);
      }
    }

    const categoryNames = [...categories.keys()].sort((left, right) => left.localeCompare(right, 'ru'));
    await this.categoriesRepository.replaceForUser(new ObjectId(user.id), categoryNames);

    return {
      operations_processed: operations.length,
      categories_count: categoryNames.length,
      categories: categoryNames,
    };
  }

  private toResponse(category: import('./types/category.type').CategoryDocument): CategoryResponseDto {
    return {
      id: category._id.toHexString(),
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  private normalizeName(name: string): string {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new BadRequestException('Название категории не может быть пустым');
    }
    return normalizedName;
  }

  private toObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный идентификатор категории');
    }
    return new ObjectId(id);
  }

  private toUserId(user: AuthenticatedUser): ObjectId {
    return new ObjectId(user.id);
  }

  private isDuplicateNameError(error: unknown): boolean {
    return error instanceof MongoServerError && error.code === 11000;
  }
}

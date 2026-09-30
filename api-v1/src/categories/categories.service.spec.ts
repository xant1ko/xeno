import { ConflictException, NotFoundException } from '@nestjs/common';
import { MongoServerError, ObjectId } from 'mongodb';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { OperationsRepository } from '../operations/operations.repository';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

const user: AuthenticatedUser = {
  id: '66e4fa78469290f19f5642b1',
  login: 'alex',
  created_at: new Date('2026-09-14T00:00:00.000Z'),
  updated_at: new Date('2026-09-14T00:00:00.000Z'),
};

describe('CategoriesService', () => {
  it('deduplicates effective categories and persists the complete set', async () => {
    const operationsRepository = {
      findAllForCategories: jest.fn().mockResolvedValue([
        { default_category: 'Продукты', custom_category: '' },
        { default_category: 'Продукты', custom_category: '' },
        { default_category: 'Переводы', custom_category: 'Свои переводы' },
        { default_category: '', custom_category: '  ' },
      ]),
    };
    const categoriesRepository = { replaceForUser: jest.fn().mockResolvedValue(undefined) };
    const service = new CategoriesService(
      operationsRepository as unknown as OperationsRepository,
      categoriesRepository as unknown as CategoriesRepository,
    );

    const result = await service.recalculate(user);

    expect(operationsRepository.findAllForCategories).toHaveBeenCalledWith(new ObjectId(user.id));
    expect(categoriesRepository.replaceForUser).toHaveBeenCalledWith(
      new ObjectId(user.id),
      ['Продукты', 'Свои переводы'],
    );
    expect(result).toEqual({
      operations_processed: 4,
      categories_count: 2,
      categories: ['Продукты', 'Свои переводы'],
    });
  });

  it('trims a category name before creating it', async () => {
    const operationsRepository = { findAllForCategories: jest.fn() };
    const categoriesRepository = {
      create: jest.fn().mockResolvedValue({
        _id: new ObjectId('66e4fa78469290f19f5642b1'),
        user_id: new ObjectId(user.id),
        name: 'Продукты',
        created_at: new Date('2026-09-14T00:00:00.000Z'),
        updated_at: new Date('2026-09-14T00:00:00.000Z'),
      }),
    };
    const service = new CategoriesService(
      operationsRepository as unknown as OperationsRepository,
      categoriesRepository as unknown as CategoriesRepository,
    );

    await service.create(user, { name: '  Продукты  ' });

    expect(categoriesRepository.create).toHaveBeenCalledWith(new ObjectId(user.id), 'Продукты');
  });

  it('converts a duplicate category index error into a conflict', async () => {
    const operationsRepository = { findAllForCategories: jest.fn() };
    const categoriesRepository = {
      create: jest.fn().mockRejectedValue(new MongoServerError({ code: 11000, errmsg: 'duplicate key' })),
    };
    const service = new CategoriesService(
      operationsRepository as unknown as OperationsRepository,
      categoriesRepository as unknown as CategoriesRepository,
    );

    await expect(service.create(user, { name: 'Продукты' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('does not expose another user category by id', async () => {
    const operationsRepository = { findAllForCategories: jest.fn() };
    const categoriesRepository = { findById: jest.fn().mockResolvedValue(null) };
    const service = new CategoriesService(
      operationsRepository as unknown as OperationsRepository,
      categoriesRepository as unknown as CategoriesRepository,
    );

    await expect(service.findOne(user, '66e4fa78469290f19f5642b1')).rejects.toBeInstanceOf(NotFoundException);
    expect(categoriesRepository.findById).toHaveBeenCalledWith(
      new ObjectId(user.id),
      new ObjectId('66e4fa78469290f19f5642b1'),
    );
  });
});

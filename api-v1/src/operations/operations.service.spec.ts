import { ObjectId } from 'mongodb';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationsRepository } from './operations.repository';
import { OperationsService } from './operations.service';
import { OperationDocument, OperationFields } from './types/operation.type';

type RepositoryMock = {
  findLatestDate: jest.Mock;
  createMany: jest.Mock;
  findAll: jest.Mock;
};

const operationDto = (date: string, description = 'Покупка'): CreateOperationDto => ({
  account_name: 'Основной счёт',
  card_number: '*0330',
  date,
  transaction_amount: -100,
  currency: 'RUB',
  status: 'Ок',
  default_category: 'Покупки',
  custom_category: '',
  description,
  message: '',
});

const user: AuthenticatedUser = {
  id: '66e4fa78469290f19f5642b1',
  login: 'alex',
  created_at: new Date('2026-09-14T00:00:00.000Z'),
  updated_at: new Date('2026-09-14T00:00:00.000Z'),
};

const toDocument = (userId: ObjectId, fields: OperationFields): OperationDocument => ({
  _id: new ObjectId(),
  user_id: userId,
  ...fields,
  created_at: new Date('2026-09-14T00:00:00.000Z'),
  updated_at: new Date('2026-09-14T00:00:00.000Z'),
});

describe('OperationsService', () => {
  let repository: RepositoryMock;
  let service: OperationsService;

  beforeEach(() => {
    repository = {
      findLatestDate: jest.fn(),
      createMany: jest.fn(async (userId: ObjectId, fields: OperationFields[]) => fields.map(fieldsItem => toDocument(userId, fieldsItem))),
      findAll: jest.fn(),
    };
    service = new OperationsService(repository as unknown as OperationsRepository);
  });

  describe('createMany', () => {
    it('creates every operation when the collection is empty', async () => {
      repository.findLatestDate.mockResolvedValue(null);

      const result = await service.createMany(user, {
        operations: [
          operationDto('2026-09-13T12:00:00.000Z', 'Поздняя'),
          operationDto('2026-09-12T12:00:00.000Z', 'Ранняя'),
        ],
      });

      expect(repository.createMany).toHaveBeenCalledTimes(1);
      expect(repository.findLatestDate).toHaveBeenCalledWith(new ObjectId(user.id));
      const inserted = repository.createMany.mock.calls[0][1] as OperationFields[];
      expect(inserted.map(operation => operation.description)).toEqual(['Ранняя', 'Поздняя']);
      expect(result).toMatchObject({ received: 2, created: 2, skipped: 0, cutoff_date: null });
    });

    it('skips the cutoff operation and every earlier operation', async () => {
      repository.findLatestDate.mockResolvedValue(new Date('2026-09-12T12:00:00.000Z'));

      const result = await service.createMany(user, {
        operations: [
          operationDto('2026-09-11T12:00:00.000Z'),
          operationDto('2026-09-12T12:00:00.000Z'),
          operationDto('2026-09-13T12:00:00.000Z'),
        ],
      });

      const inserted = repository.createMany.mock.calls[0][1] as OperationFields[];
      expect(inserted).toHaveLength(1);
      expect(inserted[0].date).toEqual(new Date('2026-09-13T12:00:00.000Z'));
      expect(result).toMatchObject({ received: 3, created: 1, skipped: 2 });
    });

    it('keeps all new operations with the same date', async () => {
      repository.findLatestDate.mockResolvedValue(new Date('2026-09-12T12:00:00.000Z'));

      const result = await service.createMany(user, {
        operations: [
          operationDto('2026-09-13T12:00:00.000Z', 'Первая'),
          operationDto('2026-09-13T12:00:00.000Z', 'Вторая'),
        ],
      });

      expect(repository.createMany.mock.calls[0][1]).toHaveLength(2);
      expect(result.created).toBe(2);
    });

    it('returns zero created operations when the entire batch is old', async () => {
      repository.findLatestDate.mockResolvedValue(new Date('2026-09-13T12:00:00.000Z'));

      const result = await service.createMany(user, {
        operations: [operationDto('2026-09-12T12:00:00.000Z')],
      });

      expect(repository.createMany).toHaveBeenCalledWith(new ObjectId(user.id), []);
      expect(result).toMatchObject({ received: 1, created: 0, skipped: 1, operations: [] });
    });

    it('accepts an empty batch', async () => {
      repository.findLatestDate.mockResolvedValue(new Date('2026-09-13T12:00:00.000Z'));

      const result = await service.createMany(user, { operations: [] });

      expect(result).toMatchObject({ received: 0, created: 0, skipped: 0, operations: [] });
    });

    it('uses a separate latest-date boundary for every user', async () => {
      const anotherUser: AuthenticatedUser = {
        ...user,
        id: '66e4fa78469290f19f5642b2',
        login: 'maria',
      };
      repository.findLatestDate
        .mockResolvedValueOnce(new Date('2026-09-13T12:00:00.000Z'))
        .mockResolvedValueOnce(null);

      const firstResult = await service.createMany(user, {
        operations: [operationDto('2026-09-12T12:00:00.000Z')],
      });
      const secondResult = await service.createMany(anotherUser, {
        operations: [operationDto('2026-09-12T12:00:00.000Z')],
      });

      expect(firstResult.created).toBe(0);
      expect(secondResult.created).toBe(1);
      expect(repository.findLatestDate).toHaveBeenNthCalledWith(1, new ObjectId(user.id));
      expect(repository.findLatestDate).toHaveBeenNthCalledWith(2, new ObjectId(anotherUser.id));
    });
  });
});

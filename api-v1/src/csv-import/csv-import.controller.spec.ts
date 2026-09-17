import { OperationsService } from '../operations/operations.service';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { CsvImportController } from './csv-import.controller';
import { CsvImportService } from './csv-import.service';

describe('CsvImportController', () => {
  it('automatically saves every successfully parsed row through createMany', async () => {
    const parsedDate = new Date('2026-09-13T03:16:23.000Z');
    const row = {
      account_name: 'Основной счёт',
      card_number: '*0330',
      date: parsedDate,
      transaction_amount: -2000,
      currency: 'RUB',
      status: 'Ок',
      default_category: 'Переводы',
      custom_category: '',
      description: 'Елизавета Б.',
      message: '',
    };
    const csvImportService = {
      parseFile: jest.fn().mockReturnValue({
        rows: [row],
        errors: [{ row: 3, message: 'Ошибка строки' }],
      }),
    };
    const saved = {
      received: 1,
      created: 1,
      skipped: 0,
      cutoff_date: null,
      operations: [],
    };
    const operationsService = {
      createMany: jest.fn().mockResolvedValue(saved),
    };
    const controller = new CsvImportController(
      csvImportService as unknown as CsvImportService,
      operationsService as unknown as OperationsService,
    );
    const file = {
      originalname: 'operations.csv',
      buffer: Buffer.from('csv'),
    } as Express.Multer.File;
    const user: AuthenticatedUser = {
      id: '66e4fa78469290f19f5642b1',
      login: 'alex',
      created_at: new Date('2026-09-14T00:00:00.000Z'),
      updated_at: new Date('2026-09-14T00:00:00.000Z'),
    };

    const result = await controller.parseCsv(user, file);

    expect(operationsService.createMany).toHaveBeenCalledWith(user, {
      operations: [{ ...row, date: parsedDate.toISOString() }],
    });
    expect(result.saved).toBe(saved);
    expect(result.errors).toHaveLength(1);
  });
});

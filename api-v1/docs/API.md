# API-документация

## Назначение

Этот раздел описывает правила разработки HTTP API для `api-v1`. Документация Swagger является частью контракта API и должна обновляться вместе с кодом.

## Базовые адреса

- API: `http://localhost:8000/api/v1`
- Swagger UI: `http://localhost:8000/api/v1/docs`
- Health-check: `GET /api/v1/health`

## Правило для новых ручек

При добавлении **каждой новой ручки** необходимо сразу описывать её в Swagger:

1. Добавить Swagger-тег контроллера через `@ApiTags`.
2. Описать метод и его назначение через `@ApiOperation`.
3. Описать все возможные HTTP-ответы через `@ApiResponse` или специализированные декораторы:
   - `@ApiOkResponse`
   - `@ApiCreatedResponse`
   - `@ApiNoContentResponse`
   - `@ApiBadRequestResponse`
   - `@ApiUnauthorizedResponse`
   - `@ApiNotFoundResponse`
   - `@ApiConflictResponse`
4. Для body, query и параметров использовать DTO-классы, а не анонимные типы.
5. Описывать поля DTO через `@ApiProperty` или `@ApiPropertyOptional`.
6. Для enum, массивов, вложенных объектов и nullable-полей явно указывать тип в Swagger-схеме.
7. Добавлять примеры значений, если формат поля не очевиден или важен для интеграции.
8. Если ручка требует авторизации, отмечать её через `@ApiBearerAuth`.

## Рекомендуемая структура ручки

```text
src/<feature>/
├── dto/
│   ├── create-<feature>.dto.ts
│   ├── update-<feature>.dto.ts
│   └── <feature>-response.dto.ts
├── <feature>.controller.ts
├── <feature>.service.ts
└── <feature>.module.ts
```

## Пример DTO

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateExampleDto {
  @ApiProperty({ example: 'Example name', description: 'Название сущности.' })
  @IsString()
  name: string;
}
```

## Пример контроллера

```ts
@ApiTags('examples')
@Controller('examples')
export class ExamplesController {
  @Post()
  @ApiOperation({ summary: 'Создать пример' })
  @ApiCreatedResponse({ type: ExampleResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные данные запроса.' })
  create(@Body() dto: CreateExampleDto): ExampleResponseDto {
    return this.examplesService.create(dto);
  }
}
```

## Что проверять перед завершением задачи

- Новая ручка отображается в Swagger UI.
- Указаны HTTP-метод, путь, краткое описание и теги.
- Для request body, query и path parameters отображаются схемы.
- Для успешных и ошибочных ответов указаны коды и DTO/описания.
- `npm run lint` проходит без ошибок.
- `npm run build` проходит без ошибок.
- Изменения Swagger-документации внесены в тот же pull request, что и код ручки.

## Operations

Модуль операций доступен по адресу `/api/v1/operations`:

- `POST /operations` — создать одну операцию.
- `POST /operations/create-many` — создать массив операций.
- `GET /operations` — получить страницу операций.
- `GET /operations/:id` — получить операцию по идентификатору.
- `PATCH /operations/:id` — частично обновить операцию.
- `DELETE /operations/:id` — удалить операцию.

`create-many` находит максимальную дату среди сохранённых операций и записывает только элементы,
у которых дата строго больше найденной. Операции с датой, равной граничной, и более ранние
пропускаются. Если коллекция пуста, записывается весь переданный массив.

`POST /csv-import` после парсинга автоматически передаёт все корректные строки в ту же логику
`create-many`. Результат записи возвращается в поле `saved`; строки с ошибками в MongoDB не передаются.

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCookieAuth, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/auth.type';
import { RecalculateCategoriesResponseDto } from './dto/recalculate-categories-response.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@ApiCookieAuth('xeno_access_token')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiConflictResponse({ description: 'Категория с таким названием уже существует.' })
  @ApiBadRequestResponse({ description: 'Некорректное название категории.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить категории пользователя' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по идентификатору' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Категория не найдена.' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор или название.' })
  @ApiConflictResponse({ description: 'Категория с таким названием уже существует.' })
  @ApiNotFoundResponse({ description: 'Категория не найдена.' })
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', example: '66e4fa78469290f19f5642b1' })
  @ApiNoContentResponse({ description: 'Категория удалена.' })
  @ApiBadRequestResponse({ description: 'Некорректный идентификатор.' })
  @ApiNotFoundResponse({ description: 'Категория не найдена.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(user, id);
  }

  @Post('recalculate')
  @ApiOperation({ summary: 'Пересчитать категории по всем операциям пользователя' })
  @ApiOkResponse({ type: RecalculateCategoriesResponseDto })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  recalculate(@CurrentUser() user: AuthenticatedUser): Promise<RecalculateCategoriesResponseDto> {
    return this.categoriesService.recalculate(user);
  }
}

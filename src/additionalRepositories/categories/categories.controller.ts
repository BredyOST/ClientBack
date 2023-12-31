import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt.guard'
import { UserId } from '../../decorators/user-id.decorator'
import { CategoryEntity } from './entities/category.entity'
import { SessionAuthService } from '../../auth/session-auth/session-auth.service'

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(
      private readonly categoriesService: CategoriesService,
      private readonly sessionAuthService: SessionAuthService
  ) {}

  // СОЗДАНИЕ КАТЕГОРИИ
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createCategory(@UserId() id: number, @Body() dto: CategoryEntity) {
    return this.categoriesService.createCategory(id, dto)
  }

  // ОБНОВЛЕНИЕ КАТЕГОРИИ
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateCategory(@UserId() id: number, @Body() dto: { id: number; id_category: string; name: string; description: string }) {
    return this.categoriesService.updateCategory(id, dto)
  }

  // УДАЛЕНИЕ КАТЕГОРИИ
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@UserId() id: number, @Body() dto: { id: number }) {
    return this.categoriesService.deleteCategory(id, dto)
  }

  // ПОЛУЧИТЬ ВСЕ КАТЕГОРИИ
  // @Get('/getAll')
  // @UseGuards(JwtAuthGuard)
  // async getAllCategories(@UserId() id: number) {
  //   return this.categoriesService.getAllCategories(id);
  // }
  @Get('/getAll')
  // @UseGuards(JwtAuthGuard)
  async getAllCategories() {
    return this.categoriesService.getAllCategories()
  }

  // ПОЛУЧИТЬ ОДНУ КАТЕГОРИЮ
  @Get('/getOne')
  @UseGuards(JwtAuthGuard)
  async getOneCategory(@UserId() id: number, dto: { id: number }) {
    return this.categoriesService.getOneCategory(id, dto)
  }

  // работа с пользователем
  @Post('/freePeriod')
  @UseGuards(JwtAuthGuard)
  async activateFreePeriod(@UserId() id: number, @Request() req, @Body() dto: number) {
    // передаем параметр запроса, который мы добавили при проверке в мидлваре а именно токен
    const result = await this.sessionAuthService.validateSessionToken(req.session)
    // если возвращается false то сессия истекла
    if (!result) {
      return {
        text: 'Ваша сессия истекла, выполните повторный вход',
      }
    }
    return this.categoriesService.activateFreePeriod(id, dto)
  }
}

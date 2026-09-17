import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [UsersRepository, UsersService], // Регистрируем хранение и доменную логику пользователей.
  exports: [UsersService], // Откроем сервис будущему AuthModule без дублирования логики.
})
export class UsersModule {}

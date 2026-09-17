import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alex', description: 'Уникальный логин из букв, цифр, символов _ и -.' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/, { message: 'Логин должен содержать от 3 до 50 символов: буквы, цифры, _ или -' })
  login!: string;

  @ApiProperty({ example: 'secure-password', minLength: 8, maxLength: 128, description: 'Пароль пользователя.' })
  @IsString()
  password!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'alex' })
  @IsString()
  login!: string;

  @ApiProperty({ example: 'secure-password' })
  @IsString()
  password!: string;
}

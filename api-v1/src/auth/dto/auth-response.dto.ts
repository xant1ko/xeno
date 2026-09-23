import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: '66e4fa78469290f19f5642b1' })
  id!: string;

  @ApiProperty({ example: 'alex' })
  login!: string;

  @ApiProperty({ example: '2026-09-17T10:00:00.000Z', format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ example: '2026-09-17T10:00:00.000Z', format: 'date-time' })
  updated_at!: Date;
}

export class AuthResponseDto {
  // JWT передаётся только в httpOnly-cookie через заголовок Set-Cookie, а не в JSON.
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

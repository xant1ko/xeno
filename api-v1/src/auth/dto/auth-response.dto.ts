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
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

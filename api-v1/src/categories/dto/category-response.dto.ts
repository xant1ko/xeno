import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: '66e4fa78469290f19f5642b1' })
  id!: string;

  @ApiProperty({ example: 'Продукты' })
  name!: string;

  @ApiProperty({ example: '2026-09-29T10:00:00.000Z', format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ example: '2026-09-29T10:00:00.000Z', format: 'date-time' })
  updated_at!: Date;
}

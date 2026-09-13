import { ApiProperty } from '@nestjs/swagger';
import { OperationResponseDto } from './operation-response.dto';

export class CreateManyOperationsResponseDto {
  @ApiProperty({ example: 100 })
  received!: number;

  @ApiProperty({ example: 12 })
  created!: number;

  @ApiProperty({ example: 88 })
  skipped!: number;

  @ApiProperty({ type: String, example: '2026-09-10T12:00:00.000Z', format: 'date-time', nullable: true })
  cutoff_date!: Date | null;

  @ApiProperty({ type: [OperationResponseDto] })
  operations!: OperationResponseDto[];
}

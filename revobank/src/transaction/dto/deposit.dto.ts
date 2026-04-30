import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 'account-id-123' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;
}
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
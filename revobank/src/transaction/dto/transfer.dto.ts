import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 'account-id-1' })
  @IsString()
  fromId: string;

  @ApiProperty({ example: 'account-id-2' })
  @IsString()
  toId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;
}
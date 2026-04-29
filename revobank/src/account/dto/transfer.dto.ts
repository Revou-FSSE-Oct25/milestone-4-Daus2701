import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  @IsString()
  fromId: string;

  @ApiProperty()
  @IsString()
  toId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
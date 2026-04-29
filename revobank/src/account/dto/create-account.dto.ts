import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
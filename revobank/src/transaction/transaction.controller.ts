import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  deposit(@Body() body: DepositDto) {
    return this.transactionService.deposit(body.accountId, body.amount);
  }

  @Post('withdraw')
  withdraw(@Body() body: { accountId: string; amount: number }) {
    return this.transactionService.withdraw(body.accountId, body.amount);
  }

  @Post('transfer')
  transfer(@Body() body: TransferDto) {
    return this.transactionService.transfer(
      body.fromId,
      body.toId,
      body.amount,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.transactionService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.transactionService.findOne(id, req.user.sub);
  }
}
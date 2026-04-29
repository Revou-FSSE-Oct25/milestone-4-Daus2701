import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string) {
    return this.prisma.account.create({
      data: {
        userId,
        accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      },
    });
  }

  async findAll() {
    return this.prisma.account.findMany();
  }

  async deposit(accountId: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const newBalance = Number(account.balance) + amount;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        status: TransactionStatus.COMPLETED,
        amount,
        balanceBefore: account.balance,
        balanceAfter: newBalance,
        toAccountId: accountId,
      },
    });
  }

  async transfer(fromId: string, toId: string, amount: number) {
    const from = await this.prisma.account.findUnique({ where: { id: fromId } });
    const to = await this.prisma.account.findUnique({ where: { id: toId } });

    if (!from || !to) {
      throw new Error('Account not found');
    }

    if (Number(from.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    const newFrom = Number(from.balance) - amount;
    const newTo = Number(to.balance) + amount;

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromId },
        data: { balance: newFrom },
      }),
      this.prisma.account.update({
        where: { id: toId },
        data: { balance: newTo },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'TRANSFER',
          status: TransactionStatus.COMPLETED,
          amount,
          balanceBefore: from.balance,
          balanceAfter: newFrom,
          fromAccountId: fromId,
          toAccountId: toId,
        },
      }),
    ]);
  }
}
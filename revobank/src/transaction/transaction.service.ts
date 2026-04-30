import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(accountId: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error('Account not found');

    const newBalance = Number(account.balance) + amount;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
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

    if (!from || !to) throw new Error('Account not found');
    if (Number(from.balance) < amount) throw new Error('Insufficient balance');

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
          type: TransactionType.TRANSFER,
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

  async withdraw(accountId: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error('Account not found');
    if (Number(account.balance) < amount)
      throw new Error('Insufficient balance');

    const newBalance = Number(account.balance) - amount;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.COMPLETED,
        amount,
        balanceBefore: account.balance,
        balanceAfter: newBalance,
        fromAccountId: accountId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccount: { userId } },
          { toAccount: { userId } },
        ],
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }
}
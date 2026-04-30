import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(accountId: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException('Account not found');

    const newBalance = Number(account.balance) + amount;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        status: 'COMPLETED',
        amount,
        balanceBefore: account.balance,
        balanceAfter: newBalance,
        toAccountId: accountId,
      },
    });
  }

  async withdraw(accountId: string, amount: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException('Account not found');

    if (Number(account.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = Number(account.balance) - amount;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return this.prisma.transaction.create({
      data: {
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
        amount,
        balanceBefore: account.balance,
        balanceAfter: newBalance,
        fromAccountId: accountId,
      },
    });
  }

  async transfer(fromId: string, toId: string, amount: number) {
    const from = await this.prisma.account.findUnique({ where: { id: fromId } });
    const to = await this.prisma.account.findUnique({ where: { id: toId } });

    if (!from || !to) throw new NotFoundException('Account not found');

    if (Number(from.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    const newFrom = Number(from.balance) - amount;
    const newTo = Number(to.balance) + amount;

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromId },
        data: { balance: newFrom },
      }),
      this.prisma.account.update({
        where: { id: toId },
        data: { balance: newTo },
      }),
    ]);

    return this.prisma.transaction.create({
      data: {
        type: 'TRANSFER',
        status: 'COMPLETED',
        amount,
        balanceBefore: from.balance,
        balanceAfter: newFrom,
        fromAccountId: fromId,
        toAccountId: toId,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    if (
      transaction.fromAccount?.userId !== userId &&
      transaction.toAccount?.userId !== userId
    ) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
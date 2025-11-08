import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { NotFoundExceptionCustom } from 'src/common/exceptions/base.exception';
import { Transaction } from '@prisma/client';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionOutput } from 'src/types/transaction-output';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto): Promise<TransactionOutput> {
    const dateISO = new Date(dto.date).toISOString();
    const transaction = await this.prisma.transaction.create({
      data: { ...dto, date: dateISO },
    });
    return this.formatTransaction(transaction);
  }

  async findAll(
    filter: FilterTransactionsDto & { userId: string },
  ): Promise<TransactionOutput[]> {
    const where: any = { userId: filter.userId };

    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;
    if (filter.category) where.category = filter.category;
    if (filter.description) {
      where.description = {
        contains: filter.description,
        mode: 'insensitive',
      };
    }

    if (filter.dateFrom || filter.dateTo) {
      where.date = {};
      if (filter.dateFrom) where.date.gte = new Date(filter.dateFrom);
      if (filter.dateTo) where.date.lte = new Date(filter.dateTo);
    }

    if (filter.minAmount || filter.maxAmount) {
      where.amount = {};
      if (filter.minAmount) where.amount.gte = filter.minAmount;
      if (filter.maxAmount) where.amount.lte = filter.maxAmount;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return transactions.map(this.formatTransaction);
  }

  async findOne(id: string): Promise<TransactionOutput> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction)
      throw new NotFoundExceptionCustom('Transaction not found');
    return this.formatTransaction(transaction);
  }

  async update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionOutput> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
    return this.formatTransaction(transaction);
  }

  async remove(id: string): Promise<TransactionOutput> {
    const transaction = await this.prisma.transaction.delete({ where: { id } });
    return this.formatTransaction(transaction);
  }

  private formatTransaction(transaction: Transaction): TransactionOutput {
    return {
      ...transaction,
      amount: Number(transaction.amount),
    };
  }
}

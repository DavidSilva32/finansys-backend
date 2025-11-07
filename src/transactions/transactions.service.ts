import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { NotFoundExceptionCustom } from 'src/common/exceptions/base.exception';
import { Transaction } from '@prisma/client';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

async create(dto: CreateTransactionDto) {
  const dateISO = new Date(dto.date).toISOString();
  return await this.prisma.transaction.create({
    data: { ...dto, date: dateISO },
  });
}


  async findAll(filter: FilterTransactionsDto & { userId: string }) {
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

    return await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) throw new NotFoundExceptionCustom('Transction not found');
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    return await this.prisma.transaction.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return await this.prisma.transaction.delete({ where: { id } });
  }
}

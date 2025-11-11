import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { BaseController } from 'src/common/controller/base.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController extends BaseController {
  constructor(private readonly service: TransactionsService) {
    super();
  }

  @Post('create')
  async createTransaction(@Body() dto: CreateTransactionDto, @Req() req) {
    const userId = req.user.id
    const transaction = await this.service.create({...dto, userId});
    return this.createResponse(
      transaction,
      'Transaction created successfully',
      201,
    );
  }

  @Get('list')
  async listTransactions(@Query() filter: FilterTransactionsDto, @Req() req) {
    const userId = req.user.id;
    const transactions = await this.service.findAll({ ...filter, userId });
    return this.createResponse(
      transactions,
      'Transactions fetched successfully',
    );
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    const transaction = await this.service.findOne(id);
    return this.createResponse(transaction, 'Transaction fetched successfully');
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const transaction = await this.service.update(id, dto);
    return this.createResponse(transaction, 'Transaction updated successfully');
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    await this.service.remove(id);
    return this.createResponse(null, 'Transaction deleted successfully');
  }
}

import { TransactionStatus, TransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;
}

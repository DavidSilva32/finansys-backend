import { TransactionType, TransactionStatus } from '@prisma/client';

export interface TransactionOutput {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  category: string;
  description: string | null;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

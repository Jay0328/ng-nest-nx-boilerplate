import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from '../middlewares/transaction.interceptor';

export function Transaction() {
  return applyDecorators(UseInterceptors(TransactionInterceptor));
}

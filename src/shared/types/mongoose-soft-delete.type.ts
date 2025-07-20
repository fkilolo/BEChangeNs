// src/shared/types/mongoose-soft-delete.type.ts
import { Model } from 'mongoose';

export interface ISoftDelete {
  deleted?: boolean;
  deletedAt?: Date;
  deleteBy?: any;
}

export interface SoftDeleteModel<T> extends Model<T> {
  softDelete: (conditions: any) => any;
  restore: (conditions: any) => any;
  countWithDeleted: (...args: any[]) => any;
  findWithDeleted: (...args: any[]) => any;
  findOneWithDeleted: (...args: any[]) => any;
}

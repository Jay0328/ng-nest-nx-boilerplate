import {
  ColumnOptions,
  CreateDateColumn as TypeormCreateDateColumn,
  UpdateDateColumn as TypeormUpdateDateColumn
} from 'typeorm';

function DateColumnFactory<T extends (options?: ColumnOptions) => any>(
  TypeormDateColumn: T,
  defaultOptions?: ColumnOptions
) {
  function DateColumn(options?: ColumnOptions): ReturnType<T> {
    return TypeormDateColumn({ ...defaultOptions, ...options });
  }

  return DateColumn;
}

export const CreateDateColumn = DateColumnFactory(TypeormCreateDateColumn, {
  type: 'datetime',
  nullable: false,
  readonly: true
});

export const UpdateDateColumn = DateColumnFactory(TypeormUpdateDateColumn, {
  type: 'datetime',
  nullable: false
});

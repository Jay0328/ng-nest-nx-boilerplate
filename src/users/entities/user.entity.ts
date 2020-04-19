import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  BaseEntity
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { CreateDateColumn, UpdateDateColumn } from '../../shared/decorators/date-columns.decorator';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setHashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
  }

  /**
   * @description
   * Avoid from exposing password.
   */
  @AfterInsert()
  @AfterUpdate()
  removePassword() {
    delete this.password;
  }
}

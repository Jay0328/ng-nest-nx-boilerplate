import { Entity, DeepPartial, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from '@nnb/server/common/orm';

/**
 * Email should be unique.
 */
@ObjectType('User')
@Entity('User')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  constructor(input?: DeepPartial<UserEntity>) {
    super(input);
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Index('email', { unique: true })
  @Column()
  email: string;

  @Field()
  @Column()
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string;
}

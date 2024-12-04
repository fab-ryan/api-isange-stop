import { Roles } from '@/enums';
import { uuid } from '@/utils';
import { Exclude, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryColumn,
  Unique,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.id = uuid();
  }

  @PrimaryColumn()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Unique('email', ['email'])
  email: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @Column()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Type(() => Date)
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at: Date;
}

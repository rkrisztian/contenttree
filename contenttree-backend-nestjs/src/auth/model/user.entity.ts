import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 50 })
  name: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @Column({ type: 'varchar', enum: Role, nullable: false, length: 20 })
  role: Role;

  constructor(name: string, passwordHash: string, role: Role) {
    this.name = name;
    this.passwordHash = passwordHash;
    this.role = role;
  }
}

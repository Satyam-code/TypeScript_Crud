import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  age: number;

  @Column()
  password: string;

  constructor(name: string, email: string, age: number, password: string) {
    this.name = name;
    this.email = email;
    this.age = age;
    this.password = password;
  }
}

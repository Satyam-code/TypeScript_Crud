import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_logs")
export class UserLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id: number;

  @Column()
  email: string;

  @Column("json", { nullable: true })
  log_data: any;

  @Column({ type: "bigint" })
  created_at: number;

  constructor(user_id: number, email: string, log_data: any, created_at: number) {
    this.user_id = user_id;
    this.email = email;
    this.log_data = log_data;
    this.created_at = created_at;
  }
}

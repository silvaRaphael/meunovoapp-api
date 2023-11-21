import { randomUUID } from "node:crypto";
import { hashSync } from "bcryptjs";

export type Roles = "admin" | "client";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: Roles;
}

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Roles;

  constructor({ id, name, email, password, role }: IUser) {
    this.id = id || randomUUID();
    this.name = name;
    this.email = email;
    this.password = hashSync(password);
    this.role = role;
  }
}

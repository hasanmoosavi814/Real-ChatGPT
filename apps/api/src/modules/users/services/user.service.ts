import { TCreateUserInput } from "@users/types/user.types";
import { UsersRepository } from "@users/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  create(input: TCreateUserInput): Promise<User> {
    return this.usersRepository.create(input);
  }
}

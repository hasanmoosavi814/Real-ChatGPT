import { UsersRepository } from "@users/repositories/user.repository";
import { PrismaModule } from "@prisma/prisma.module";
import { UsersService } from "@users/services/user.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

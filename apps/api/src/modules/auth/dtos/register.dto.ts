import { IsEmail, IsOptional, IsString } from "class-validator";
import { Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address." })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @MaxLength(100)
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  @Matches(/[0-9]/, {
    message: "Password must contain at least one number.",
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

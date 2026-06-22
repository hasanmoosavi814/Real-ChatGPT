export type TCreateUserInput = {
  email: string;
  passwordHash: string;
  name?: string | null;
};

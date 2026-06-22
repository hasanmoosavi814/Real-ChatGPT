export type TPublicUser = {
  id: string;
  email: string;
  createdAt: Date;
  name: string | null;
};

export type JwtExpiresIn = "15m" | "1h" | "12h" | "1d" | "7d";

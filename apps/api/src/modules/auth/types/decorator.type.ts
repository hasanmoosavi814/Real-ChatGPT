export type TAuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type TRequestWithUser = Request & {
  user?: TAuthUser;
};

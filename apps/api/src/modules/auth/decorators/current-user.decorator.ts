import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TAuthUser, TRequestWithUser } from "@auth/types/decorator.type";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TAuthUser => {
    const request = ctx.switchToHttp().getRequest<TRequestWithUser>();
    if (!request.user)
      throw new Error("Current user is not available on the request.");
    return request.user;
  },
);

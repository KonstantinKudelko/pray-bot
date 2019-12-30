import { ContextMessageUpdate } from 'telegraf';

import { Need } from '../../../../models';

export const exposeNeed = (ctx: ContextMessageUpdate, next: () => void) => {
  const { payload } = JSON.parse(ctx.callbackQuery.data);

  ctx.need = ctx.session.needs.find((item: Need) => item._id.toString() === payload);

  return next();
};

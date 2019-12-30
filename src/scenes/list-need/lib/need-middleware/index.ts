import { ContextMessageUpdate } from 'telegraf';

import { Need, UserModel } from '../../../../models';

export const exposeNeed = async (ctx: ContextMessageUpdate, next: () => void) => {
  const { payload } = JSON.parse(ctx.callbackQuery.data);
  const { needs } = await UserModel.findById(ctx.from.id);

  ctx.need = needs.find((item: Need) => item._id.toString() === payload);

  return next();
};

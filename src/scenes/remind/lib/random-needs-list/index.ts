import { Extra, Markup } from 'telegraf';

import { Need } from '../../../../models';

export const randomNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [m.callbackButton(x.name, JSON.stringify(null), false)]),
      {},
    ),
  );

import { Extra, Markup } from 'telegraf';

import { Need } from '../../../../models';
import { decrypt } from '../../../../scenes/create-need/lib/encrypt';

export const randomNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [m.callbackButton(decrypt(x.name), JSON.stringify(null), false)]),
      {},
    ),
  );

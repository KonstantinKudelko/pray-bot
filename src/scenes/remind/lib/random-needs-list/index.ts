import { Extra, Markup } from 'telegraf';

import { Need } from '../../../../models';

export const randomNeedsList = (needs: Need[], prayedButtonText: string) => {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        ...needs.map(x => [m.callbackButton(x.name, JSON.stringify(null), false)]),
        [
          m.callbackButton(
            prayedButtonText,
            JSON.stringify({ action: 'prayed', payload: needs }),
            !needs.length,
          ),
        ],
      ],
      {},
    ),
  );
};

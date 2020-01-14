import { Extra, Markup } from 'telegraf';

import { Need } from '../../../../models';

export const randomNeedsList = (needs: Need[], prayedButtonText: string) => {
  return Extra.HTML().markup((m: Markup) => {
    return m.inlineKeyboard(
      [
        ...needs.map(x => [m.callbackButton(x.name, JSON.stringify(null), false)]),
        [
          {
            text: prayedButtonText,
            callback_data: JSON.stringify({ action: 'prayed', payload: [] }),
            hide: !needs.length,
          },
        ],
      ],
      {},
    );
  });
};

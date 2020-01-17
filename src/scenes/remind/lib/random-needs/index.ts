import { Extra, Markup } from 'telegraf';

import { Need } from '../../../../models';
import { decrypt } from '../../../../scenes/lib/encrypt';
import { NEED_STATUS } from '../../../lib/constants';

export const getRandomNeeds = (needs: Need[], qty = 5): Need[] => {
  const activeNeeds = needs.filter(x => x.status === NEED_STATUS.ACTIVE);
  const shuffledNeeds = activeNeeds.sort(() => 0.5 - Math.random());

  if (activeNeeds.length <= qty) {
    return activeNeeds;
  }

  return shuffledNeeds.slice(0, qty);
};

export const getRandomNeedsList = (needs: Need[], prayedButtonText: string) => {
  return Extra.HTML().markup((m: Markup) => {
    return m.inlineKeyboard(
      [
        ...needs.map(x => [
          m.callbackButton(decrypt(x.name), JSON.stringify(null), false),
        ]),
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

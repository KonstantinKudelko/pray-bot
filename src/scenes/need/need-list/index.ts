import { Markup, Extra } from 'telegraf';

import { Need } from '../../../models';
import { decrypt } from '../../lib/encrypt';

export const getNeedsByStatus = (needs: Need[], status: string) =>
  needs.filter(need => need.status === status);

export const getNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [
        m.callbackButton(
          `${decrypt(x.name)}`,
          JSON.stringify({ action: 'need', payload: x._id.toString() }),
          false,
        ),
      ]),
      {},
    ),
  );

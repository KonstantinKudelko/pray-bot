import { Markup, Extra } from 'telegraf';

import { Need } from '../../../../models';
import { NEED_STATUS } from '../../../lib/constants';

export const getNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [
        m.callbackButton(
          `${x.name} ${x.status === NEED_STATUS.ACTIVE ? ' ➖ 🙏' : ' ➖ ✅'}`,
          JSON.stringify({ action: 'need', payload: x._id.toString() }),
          false,
        ),
      ]),
      {},
    ),
  );

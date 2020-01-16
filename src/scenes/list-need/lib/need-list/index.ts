import { Markup, Extra } from 'telegraf';

import { Need } from '../../../../models';
import { decrypt } from '../../../../scenes/lib/encrypt';
import { NEED_STATUS } from '../../../lib/constants';

export const getNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [
        m.callbackButton(
          `${decrypt(x.name)} ${x.status === NEED_STATUS.ACTIVE ? ' ➖ 🙏' : ' ➖ ✅'}`,
          JSON.stringify({ action: 'need', payload: x._id.toString() }),
          false,
        ),
      ]),
      {},
    ),
  );

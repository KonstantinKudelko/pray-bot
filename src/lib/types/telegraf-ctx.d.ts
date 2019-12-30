import { I18n } from 'telegraf-i18n';

import { Need } from '../../models';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: {
      enter: (x: string) => void;
      leave: () => void;
    };
    widget: any;
    session: {
      needs: Need[];
    };
    need: Need;
  }
}

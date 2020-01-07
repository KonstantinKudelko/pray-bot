import Scene from 'telegraf/scenes/base';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES } from '../lib/constants';

export const aboutUsScene = new Scene(SCENES.ABOUT_US);

aboutUsScene.enter(async ({ reply, i18n }: ContextMessageUpdate) => {
  await reply(i18n.t('scenes.about_us.welcome'), {
    disable_web_page_preview: true,
  } as any);
});

import { Document } from 'mongoose';

import { encrypt } from '../../../scenes/lib/encrypt';
import { NEED_STATUS } from '../../../scenes/lib/constants';
import { User, NeedModel } from '../../../models';

export const handleAnsweredNeedMode = async (
  user: User,
  needId: string,
  text: string,
) => {
  await ((user.needs as unknown) as Document).id(needId).set({ answer: encrypt(text) });
  await user.save();
};

export const handleCreatingNeedMode = async (user: User, text: string) => {
  ++user.totalNeeds;
  user.needs.push(
    new NeedModel({
      name: encrypt(text),
      status: NEED_STATUS.ACTIVE,
    }),
  );

  await user.save();
};

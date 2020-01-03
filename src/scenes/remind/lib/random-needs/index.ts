import { Need } from '../../../../models';
import { NEED_STATUS } from '../../../../scenes/lib/constants';

export const getRandomNeeds = (needs: Need[], qty = 5): Need[] => {
  const activeNeeds = needs.filter(x => x.status === NEED_STATUS.ACTIVE);
  const shuffledNeeds = activeNeeds.sort(() => 0.5 - Math.random());

  if (activeNeeds.length <= qty) {
    return activeNeeds;
  }

  return shuffledNeeds.slice(0, qty);
};

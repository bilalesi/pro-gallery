import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Responsive Type',
  isRelevant: (styleParams) => !styleParams.oneRow,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.gridStyle.FIT_TO_SCREEN,
  options: createOptions('gridStyle'),
  description: `Choose between adjusting the number of columns addording to the container
  size or setting it manualy and keep it fixed.`,
  alert: 'This option will disable the responsive feature of the gallery!'
}
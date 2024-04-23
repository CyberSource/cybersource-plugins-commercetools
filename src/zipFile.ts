import path from 'path';

import DirArchiver from 'dir-archiver';

import { Constants } from './constants';
import paymentUtils from './utils/PaymentUtils';

const setupZipFile = async () => {
  let zipCompleted = false;
  try {
    const excludes = ['.slsignore', '.serverless'];
    const archive = new DirArchiver('', 'ctExtension.zip', Constants.STRING_FALSE, excludes);
    archive.createZip();
    zipCompleted = true;
  } catch (error) {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'setUpZipFile', Constants.LOG_ERROR, '', error);
  }
  return zipCompleted;
};

export { setupZipFile };

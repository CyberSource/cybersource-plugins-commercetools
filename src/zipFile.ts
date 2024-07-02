import path from 'path';

import DirArchiver from 'dir-archiver';

import { Constants } from './constants';
import paymentUtils from './utils/PaymentUtils';

/**
 * Creates a ZIP file asynchronously using DirArchiver.
 * @returns {Promise<boolean>} A promise that resolves to true if the ZIP file creation is successful, otherwise false.
 */
const setupZipFile = async (): Promise<boolean> => {
  let zipCompleted = false;
  try {
    const excludes = ['.slsignore', '.serverless'];
    const archive = new DirArchiver('', 'ctExtension.zip', Constants.STRING_FALSE, excludes);
    archive.createZip();
    zipCompleted = true;
  } catch (error) {
    paymentUtils.logData(path.parse(path.basename(__filename)).name, 'setUpZipFile', Constants.LOG_ERROR, '', JSON.stringify(error));
  }
  return zipCompleted;
};

export { setupZipFile };

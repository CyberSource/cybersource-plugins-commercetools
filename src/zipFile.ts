import DirArchiver from 'dir-archiver';

import { Constants } from './constants/constants';
import { FunctionConstant } from './constants/functionConstant';
import paymentUtils from './utils/PaymentUtils';

/**
 * Creates a ZIP file asynchronously using DirArchiver.
 * @returns {Promise<boolean>} A promise that resolves to true if the ZIP file creation is successful, otherwise false.
 */
const setupZipFile = async (): Promise<boolean> => {
  let isZipCompleted = false;
  try {
    const excludes = ['.slsignore', '.serverless'];
    const archive = new DirArchiver('', 'ctExtension.zip', Constants.STRING_FALSE, excludes);
    archive.createZip();
    isZipCompleted = true;
  } catch (error) {
    paymentUtils.logData(__filename, FunctionConstant.FUNC_SET_UP_ZIP_FILE, Constants.LOG_ERROR, '', JSON.stringify(error));
  }
  return isZipCompleted;
};

export { setupZipFile };

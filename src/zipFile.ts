import DirArchiver from 'dir-archiver';

import { FunctionConstant } from './constants/functionConstant';
import { Constants } from './constants/paymentConstants';
import { errorHandler, SystemError } from './utils/ErrorHandler';

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
    errorHandler.logError(new SystemError('', JSON.stringify(error) ,FunctionConstant.FUNC_SET_UP_ZIP_FILE),__filename, '');
  }
  return isZipCompleted;
};

export { setupZipFile };

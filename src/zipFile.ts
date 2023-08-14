import DirArchiver from 'dir-archiver';
import path from 'path';
import { Constants } from './constants';
import paymentService from './utils/PaymentService';

const setupZipFile = async () => {
    try {
        const excludes = ['.slsignore', '.serverless']
        const archive = new DirArchiver(Constants.STRING_EMPTY, 'ctPlugin.zip', Constants.STRING_FALSE, excludes);
        archive.createZip();
    } catch (error) {
        paymentService.logData(path.parse(path.basename(__filename)).name, Constants.FUNC_SET_UP_ZIP_FILE, Constants.LOG_ERROR, null, error);
    }
};

export { setupZipFile };

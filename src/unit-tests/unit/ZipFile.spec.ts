import test from 'ava';
import dotenv from 'dotenv';

import { setupZipFile } from '../../zipFile';

dotenv.config();

test.serial('creating zip file', async (t: any) => {
  try {
    let result = await setupZipFile();
    if (result == true) {
      t.is(typeof result, 'boolean');
    } else {
      t.fail(`Unexpected error: setupZipFile ${typeof result}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      t.fail(`Caught an error during execution: ${error.message}`);
    } else {
      t.fail(`Caught an unknown error: ${String(error)}`);
    }
  }
});
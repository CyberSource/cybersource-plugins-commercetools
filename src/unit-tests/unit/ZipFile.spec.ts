import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import { setupZipFile } from '../../zipFile';

test.serial('creating zip file ', async (t) => {
  let result = await setupZipFile();
  t.is(typeof result, 'boolean');
});

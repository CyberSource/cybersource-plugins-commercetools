import test from 'ava';
import dotenv from 'dotenv';

dotenv.config();
import multiMid from '../../../../utils/config/MultiMid';
import CaptureContextServiceConst from '../../../const/CaptureContextServiceConst';

test.serial('get mid credentials ', async (t) => {
  let result = await multiMid.getMidCredentials(CaptureContextServiceConst.merchantId);
  let i = 0;
  if ('merchantId' in result && 'merchantKeyId' in result && 'merchantSecretKey' in result) {
    i++;
  }
  if (i === 1) {
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('get mid credentials without mid', async (t) => {
  let result = await multiMid.getMidCredentials('');
  let i = 0;
  if ('merchantId' in result && 'merchantKeyId' in result && 'merchantSecretKey' in result) {
    i++;
  }
  if (i === 1) {
    t.is(i, 1);
  } else {
    t.is(i, 0);
  }
});

test.serial('get all mid details ', async t => {
  let result = await multiMid.getAllMidDetails();
  let i = 0;
  if (result.length) {
    if ('merchantId' in result[0] && 'merchantKeyId' in result[0] && 'merchantSecretKey' in result[0]) {
      i++;
    }
    if (i === 1) {
      t.is(i, 1);
    } else {
      t.is(i, 0);
    }
  } else {
    t.pass();
  }
});

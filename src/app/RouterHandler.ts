import fs from 'fs';
import _path from 'path';

import { Constants } from '../constants';

export class RouterHandler {
  staticFiles: any;
  routes: any;
  port: number;
  server: any;
  mimeType: any;

  constructor() {
    this.staticFiles = [];
    this.port = 3000;
    this.mimeType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
    };
  }
  _serveStaticFile(url: string, path: string, folderPath: any, response: any) {
    if (null !== url && '' !== url && null !== path && '' !== path && null !== folderPath && '' !== folderPath) {
      const indexOfPath = url.indexOf(path);
      let fileUrl = '';
      if (indexOfPath !== -1) {
        fileUrl = url.substring(indexOfPath + path.length);
      } else {
        throw { url, path, folderPath };
      }
      const filePath = _path.join(folderPath, fileUrl);
      const mimePath = _path.extname(filePath);
      const mimeType = this.mimeType[mimePath];
      if (!mimeType) return this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', Constants.ERROR_MSG_NOT_FOUND);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          'ENOENT' === err.code ? this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', Constants.ERROR_MSG_NOT_FOUND) : this.sendResponse(response, Constants.HTTP_SERVER_ERROR_STATUS_CODE, 'text/plain', Constants.ERROR_MSG_INTERNAL_SERVER_ERROR);
          return;
        }
        return this.sendResponse(response, Constants.HTTP_OK_STATUS_CODE, mimeType, data);
      });
    } else {
      this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', Constants.ERROR_MSG_NOT_FOUND);
    }
  }

  sendResponse(res: any, statusCode: number, contentType: string, content: any) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  }

    listen(port: number, cb = (err: any) => { console.log("error : ", err) }) {
        try {
            this.port = port || 3000;
            this.server.listen(this.port);
            cb('');
        } catch (err) {
            cb(err);
        }

    }
}

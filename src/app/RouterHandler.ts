import fs from 'fs';
import _path from 'path';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
/**
 * Handles routing and serving static files.
 */
export class RouterHandler {
  staticFiles: any;
  routes: any;
  port: number;
  server: any;
  mimeType: any;

  /**
   * Creates an instance of RouterHandler.
   */
  constructor() {
    this.staticFiles = [];
    this.port = Constants.DEFAULT_PORT;
    this.mimeType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
    };
  }

  /**
   * Serves a static file.
   * @param {string} url - The URL of the requested file.
   * @param {string} path - The path of the requested file.
   * @param {string} folderPath - The folder path where the file is located.
   * @param {http.ServerResponse} response - The HTTP response object.
   */
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
      if (!mimeType) {
        return this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', CustomMessages.ERROR_MSG_NOT_FOUND);
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          'ENOENT' === err.code ? this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', CustomMessages.ERROR_MSG_NOT_FOUND) : this.sendResponse(response, Constants.HTTP_SERVER_ERROR_STATUS_CODE, 'text/plain', CustomMessages.ERROR_MSG_INTERNAL_SERVER_ERROR);
          return;
        }
        return this.sendResponse(response, Constants.HTTP_OK_STATUS_CODE, mimeType, data);
      });
    } else {
      this.sendResponse(response, Constants.HTTP_NOT_FOUND_STATUS_CODE, 'text/plain', CustomMessages.ERROR_MSG_NOT_FOUND);
    }
  }

  /**
   * Sends an HTTP response.
   * @param {http.ServerResponse} res - The HTTP response object.
   * @param {number} statusCode - The status code of the response.
   * @param {string} contentType - The content type of the response.
   * @param {any} content - The content of the response.
   */
  sendResponse(res: any, statusCode: number, contentType: string, content: any) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  }

  /**
   * Starts listening on the specified port.
   * @param {number} port - The port number to listen on.
   * @param {Function} cb - The callback function to be called after listening.
   */
  listen(port: number, callback = (err: any) => { console.log("error : ", err) }) {
    try {
      this.port = port || Constants.DEFAULT_PORT;
      this.server.listen(this.port, () => {
        callback(null);
      });
    } catch (err) {
      callback(err);
    }
  }
}

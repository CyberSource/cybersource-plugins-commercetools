import http from 'http';
import path from 'path';
import url from 'url';

import cors from 'cors';

import { Constants } from '../constants/constants';
import { CustomMessages } from '../constants/customMessages';
import { FunctionConstant } from '../constants/functionConstant';
import paymentUtils from '../utils/PaymentUtils';

import { RouterHandler } from './RouterHandler';

type MiddlewareFunction = (req: any, res: any, next: () => void) => void;

/**
 * Handles incoming HTTP requests and applies middleware before processing.
 */
export class AppHandler extends RouterHandler {
  private middlewareFunction: MiddlewareFunction[];

  /**
   * Creates an instance of AppHandler.
   * @param {MiddlewareFunction[]} middlewareFunction - An array of middleware functions to apply.
   */
  constructor(middlewareFunction: MiddlewareFunction[]) {
    super();
    this.routes = [];
    this.staticFiles = {};
    this.middlewareFunction = middlewareFunction;
    this.server = http.createServer();
    this.server.on('request', this.runMiddleware.bind(this));
  }

  /**
   * Runs middleware functions before processing the incoming request.
   * @param {http.IncomingMessage} req - The HTTP request object.
   * @param {http.ServerResponse} res - The HTTP response object.
   */
  private runMiddleware(req: any, res: any): void {
    const rootDir = path.resolve(__dirname, '../');
    const requestUrl = req.url as string;
    const corsMiddleWare = cors();
    corsMiddleWare(req, res, () => {
      if (requestUrl) {
        const parsedUrl = url.parse(requestUrl, true);
        if (parsedUrl?.pathname && parsedUrl?.href) {
          switch (parsedUrl.pathname) {
            case '/': {
              res.end('navigate to /orders');
              break;
            }
            case '/css/styles.css': {
              if (parsedUrl.path) {
                this._serveStaticFile(parsedUrl.href, parsedUrl.path, rootDir + '/views/css/styles.css', res);
              }
              break;
            }
            case '/javascript/paymentDetails.js': {
              if (parsedUrl.path) {
                this._serveStaticFile(parsedUrl.href, parsedUrl.path, rootDir + '/views/javascript/paymentDetails.js', res);
              }
              break;
            }
            case '/javascript/orders.js': {
              if (parsedUrl.path) {
                this._serveStaticFile(parsedUrl.href, parsedUrl.path, rootDir + '/views/javascript/orders.js', res);
              }
              break;
            }
            case '/javascript/utils.js': {
              if (parsedUrl.path) {
                this._serveStaticFile(parsedUrl.href, parsedUrl.path, rootDir + '/views/javascript/utils.js', res);
              }
              break;
            }
            case '/billingImage.png': {
              if (parsedUrl.path) {
                this._serveStaticFile(parsedUrl.href, parsedUrl.path, rootDir + '/views/images/billingImage.png', res);
              }
              break;
            }
            case '/shippingImage.png': {
              this._serveStaticFile(parsedUrl.href, parsedUrl.pathname, rootDir + '/views/images/shippingImage.png', res);
              break;
            }
            case '/favicon.ico': {
              paymentUtils.logData(__filename, FunctionConstant.FUNC_REQUEST_HANDLER, Constants.LOG_INFO, '', CustomMessages.SUCCESS_MSG_FAV_ICON);
              res.statusCode = 400;
              res.end();
              break;
            }
            default: {
              if (this.middlewareFunction.length) {
                const middlewareFunction = this.middlewareFunction[0];
                middlewareFunction(req, res, () => {
                  this.runMiddleware(req, res);
                });
              } else {
                res.statusCode = Constants.HTTP_NOT_FOUND_STATUS_CODE;
                res.setHeader('Content-Type', 'text/plain');
                res.end(CustomMessages.ERROR_MSG_NOT_FOUND);
              }
            }
          }
        } else {
          res.end();
        }
      } else {
        res.end();
      }
    })
  }
}

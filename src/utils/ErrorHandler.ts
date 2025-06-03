import path from 'path';

import winston, { format } from 'winston';

import 'winston-daily-rotate-file';
import { Constants } from '../constants/paymentConstants';

// ---------- Base Error Class ----------
export class PaymentError extends Error {
  public code: string;
  public details?: any;
  public source: string;

  constructor(
    message: string,
    code: string,
    details?: any,
    source = ''
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.source = source;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toLogFormat(): any {
    return {
      functionName: this.source,
      code: this.code,
      message: this.message,
      details: this.details,
      stack: this.stack
    };
  }
}

// ---------- Custom Error Types ----------
export class ValidationError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'ValidationError', details, source);
  }
}

export class AuthenticationError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'AuthenticationError', details, source);
  }
}

export class AuthorizationError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'AuthorizationError', details, source);
  }
}

export class NotFoundError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'NotFoundError', details, source);
  }
}

export class PaymentProcessingError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'PaymentProcessingError', details, source);
  }
}

export class ApiError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'ApiError', details, source);
  }
}

export class SystemError extends PaymentError {
  constructor(message: string, details?: any, source = '') {
    super(message, 'SystemError', details, source);
  }
}

// ---------- Error Handler Singleton ----------
export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: winston.Logger | null = null;

  private constructor() {
    // Skip logger init in serverless
    if (
      Constants.STRING_AZURE !== process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT &&
      Constants.STRING_AWS !== process.env.PAYMENT_GATEWAY_SERVERLESS_DEPLOYMENT
    ) {
      const { combine, timestamp, printf, metadata } = format;

      const loggingFormat = printf(({ timestamp, label, level, message, metadata }) => {
        const metaString =
          metadata && Object.keys(metadata).length ? '\n' + JSON.stringify(metadata, null, 2) : '';
        return `[${timestamp}] [${label}] [${level.toUpperCase()}] : ${message}${metaString}`;
      });

      this.logger = winston.createLogger({
        format: combine(
          timestamp(),
          metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
          loggingFormat
        ),
        transports: [
          new winston.transports.DailyRotateFile({
            filename: 'src/loggers/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
          })
        ]
      });
    }
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public createErrorFromHttpStatus(status: number, message: string, source: string, details?: any): PaymentError {
    switch (status) {
      case 400:
        return new ValidationError(message, details, source);
      case 401:
        return new AuthenticationError(message, details, source);
      case 403:
        return new AuthorizationError(message, details, source);
      case 404:
        return new NotFoundError(message, details, source);
      case 422:
        return new PaymentProcessingError(message, details, source);
      default:
        return new ApiError(message, details, source);
    }
  }

  // Core error logger
  public logError(error: Error | PaymentError, filePath: string, id: string): void {
    const fileName = path.parse(path.basename(filePath)).name;

    const logObject: any = {
      label: fileName,
      level: 'error',
      message: error.message,
      ...(error instanceof PaymentError ? error.toLogFormat() : { stack: error.stack })
    };
    if (id) {
      logObject.id = encodeURI(id);
    }
    if (this.logger) {
      this.logger.log(logObject);
    }
  }
}
// Export singleton
export const errorHandler = ErrorHandler.getInstance();

/**
 * ============================================================================
 * REALDRIVE SERVER CORE — HTTP & MIDDLEWARE TYPES
 * ============================================================================
 * Type definitions, standard HTTP status codes, request/response models,
 * routing contexts, and validation schemas.
 */

import { IncomingMessage, ServerResponse } from 'http';

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface HttpRequestParams {
  [key: string]: string;
}

export interface HttpRequestQuery {
  [key: string]: string | string[] | undefined;
}

export interface HttpRequestHeaders {
  [key: string]: string | string[] | undefined;
}

export interface AuthenticatedUser {
  id: string;
  userId?: string;
  username: string;
  email: string;
  role: 'player' | 'admin' | 'moderator' | 'marshal';
  driverLevel: number;
  cash: number;
  reputation: number;
  permissions: string[];
  sessionId: string;
}

export interface CustomHttpRequest extends IncomingMessage {
  id: string;
  path: string;
  pathname: string;
  params: HttpRequestParams;
  query: HttpRequestQuery;
  body: any;
  rawBody: Buffer;
  user?: AuthenticatedUser;
  startTime: number;
  remoteIp: string;
  cookies: Record<string, string>;
  files?: Record<string, any>;
}

export interface CustomHttpResponse extends ServerResponse {
  send(body: any): this;
  json(data: any): this;
  status(code: number): this;
  setHeader(name: string, value: number | string | readonly string[]): this;
  redirect(url: string, status?: number): void;
  cookie(name: string, value: string, options?: CookieOptions): this;
  clearCookie(name: string): this;
}

export interface ControllerResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

export type HttpRequest = CustomHttpRequest;
export type HttpResponse = CustomHttpResponse | ControllerResponse | any;

export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  domain?: string;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

export type NextFunction = (err?: any) => void | Promise<void>;

export type MiddlewareHandler = (
  req: CustomHttpRequest,
  res: CustomHttpResponse,
  next: NextFunction
) => void | Promise<void>;

export type RouteHandler = (
  req: CustomHttpRequest,
  res: CustomHttpResponse
) => any;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  pattern: RegExp;
  paramNames: string[];
  handlers: MiddlewareHandler[];
  action: RouteHandler;
  description?: string;
  tags?: string[];
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    executionTimeMs: number;
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export class HttpError extends Error {
  public statusCode: HttpStatus;
  public details?: any;
  public errorCode: string;

  constructor(statusCode: HttpStatus, message: string, errorCode: string = 'HTTP_ERROR', details?: any) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  public static badRequest(message: string = 'Bad Request', details?: any): HttpError {
    return new HttpError(HttpStatus.BAD_REQUEST, message, 'BAD_REQUEST', details);
  }

  public static unauthorized(message: string = 'Unauthorized', details?: any): HttpError {
    return new HttpError(HttpStatus.UNAUTHORIZED, message, 'UNAUTHORIZED', details);
  }

  public static forbidden(message: string = 'Forbidden', details?: any): HttpError {
    return new HttpError(HttpStatus.FORBIDDEN, message, 'FORBIDDEN', details);
  }

  public static notFound(message: string = 'Resource Not Found', details?: any): HttpError {
    return new HttpError(HttpStatus.NOT_FOUND, message, 'NOT_FOUND', details);
  }

  public static conflict(message: string = 'Resource Conflict', details?: any): HttpError {
    return new HttpError(HttpStatus.CONFLICT, message, 'CONFLICT', details);
  }

  public static unprocessableEntity(message: string = 'Unprocessable Entity', details?: any): HttpError {
    return new HttpError(HttpStatus.UNPROCESSABLE_ENTITY, message, 'UNPROCESSABLE_ENTITY', details);
  }

  public static tooManyRequests(message: string = 'Too Many Requests', details?: any): HttpError {
    return new HttpError(HttpStatus.TOO_MANY_REQUESTS, message, 'TOO_MANY_REQUESTS', details);
  }

  public static internal(message: string = 'Internal Server Error', details?: any): HttpError {
    return new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR', details);
  }
}

/**
 * ============================================================================
 * REALDRIVE SERVER CORE — MIDDLEWARE REGISTRY
 * ============================================================================
 * Standard production-grade HTTP middlewares:
 * - CORS (Cross-Origin Resource Sharing)
 * - Security Headers (CSP, HSTS, X-Frame-Options, Referrer-Policy)
 * - Rate Limiter (Token bucket & Sliding Window)
 * - Request ID Generator & Request Logger
 * - JSON & Form Body Parser
 * - JWT Authentication Token Extractor & RBAC Guard
 * - Compression & Cache-Control
 * - Global Exception / Error Boundary
 */

import {
  CustomHttpRequest,
  CustomHttpResponse,
  MiddlewareHandler,
  NextFunction,
  HttpStatus,
  HttpError,
  ApiResponse,
  AuthenticatedUser,
} from './HttpTypes.js';
import { LoggerService } from './LoggerService.js';
import { ConfigManager } from './ConfigManager.js';
import crypto from 'crypto';

export class MiddlewareRegistry {
  private static logger = LoggerService.getInstance().createScopedLogger('Middleware');

  /**
   * Generates a unique Request ID for distributed tracing and context logging.
   */
  public static requestId(): MiddlewareHandler {
    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      const incomingId = req.headers['x-request-id'] as string;
      req.id = incomingId || crypto.randomUUID();
      req.startTime = performance.now();
      req.remoteIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

      res.setHeader('X-Request-ID', req.id);
      next();
    };
  }

  /**
   * Enriches the response object with convenience helpers (.status(), .json(), .send()).
   */
  public static responseEnhancer(): MiddlewareHandler {
    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      let responseEnded = false;

      res.status = function (code: number): CustomHttpResponse {
        this.statusCode = code;
        return this;
      };

      res.json = function (data: any): CustomHttpResponse {
        if (responseEnded) return this;
        responseEnded = true;

        const duration = Math.round(performance.now() - req.startTime);
        const payload: ApiResponse = {
          success: this.statusCode >= 200 && this.statusCode < 400,
          statusCode: this.statusCode,
          data: data,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: req.id,
            executionTimeMs: duration,
          },
        };

        const jsonStr = JSON.stringify(payload);
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
        this.setHeader('Content-Length', Buffer.byteLength(jsonStr));
        this.end(jsonStr);
        return this;
      };

      res.send = function (body: any): CustomHttpResponse {
        if (responseEnded) return this;
        responseEnded = true;

        if (typeof body === 'object' && !Buffer.isBuffer(body)) {
          return this.json(body);
        }

        if (typeof body === 'string') {
          if (!this.getHeader('Content-Type')) {
            this.setHeader('Content-Type', 'text/html; charset=utf-8');
          }
          this.setHeader('Content-Length', Buffer.byteLength(body));
          this.end(body);
        } else if (Buffer.isBuffer(body)) {
          if (!this.getHeader('Content-Type')) {
            this.setHeader('Content-Type', 'application/octet-stream');
          }
          this.setHeader('Content-Length', body.length);
          this.end(body);
        } else {
          this.end(String(body));
        }

        return this;
      };

      res.cookie = function (name: string, value: string, options: any = {}): CustomHttpResponse {
        const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
        if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
        if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
        if (options.path) parts.push(`Path=${options.path}`); else parts.push('Path=/');
        if (options.domain) parts.push(`Domain=${options.domain}`);
        if (options.secure) parts.push('Secure');
        if (options.httpOnly) parts.push('HttpOnly');
        if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

        const existing = res.getHeader('Set-Cookie');
        if (Array.isArray(existing)) {
          res.setHeader('Set-Cookie', [...existing, parts.join('; ')]);
        } else if (typeof existing === 'string') {
          res.setHeader('Set-Cookie', [existing, parts.join('; ')]);
        } else {
          res.setHeader('Set-Cookie', parts.join('; '));
        }
        return this;
      };

      res.clearCookie = function (name: string): CustomHttpResponse {
        return this.cookie(name, '', { expires: new Date(0), path: '/' });
      };

      // Cookie Parser on request
      const rawCookie = req.headers.cookie;
      req.cookies = {};
      if (rawCookie) {
        rawCookie.split(';').forEach((pair) => {
          const idx = pair.indexOf('=');
          if (idx > 0) {
            const k = pair.substring(0, idx).trim();
            const v = pair.substring(idx + 1).trim();
            try {
              req.cookies[decodeURIComponent(k)] = decodeURIComponent(v);
            } catch {
              req.cookies[k] = v;
            }
          }
        });
      }

      next();
    };
  }

  /**
   * Request logging middleware with duration and HTTP status codes.
   */
  public static loggerMiddleware(): MiddlewareHandler {
    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      res.on('finish', () => {
        const duration = Math.round(performance.now() - req.startTime);
        const status = res.statusCode;
        const msg = `${req.method} ${req.url} -> ${status} [${duration}ms]`;

        if (status >= 500) {
          this.logger.error(msg, undefined, { requestId: req.id, ip: req.remoteIp, durationMs: duration, statusCode: status });
        } else if (status >= 400) {
          this.logger.warn(msg, { requestId: req.id, ip: req.remoteIp, durationMs: duration, statusCode: status });
        } else {
          this.logger.info(msg, { requestId: req.id, ip: req.remoteIp, durationMs: duration, statusCode: status });
        }
      });

      next();
    };
  }

  /**
   * CORS headers configuration.
   */
  public static cors(options: {
    origin?: string | string[] | ((origin: string) => boolean);
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  } = {}): MiddlewareHandler {
    const defaultMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'];
    const defaultHeaders = ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Client-Version', 'X-Session-ID'];

    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      const origin = req.headers.origin as string;
      const allowedOrigin = options.origin || '*';

      if (typeof allowedOrigin === 'string') {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      } else if (Array.isArray(allowedOrigin)) {
        if (origin && allowedOrigin.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
          res.setHeader('Access-Control-Allow-Origin', allowedOrigin[0] || '*');
        }
      } else if (typeof allowedOrigin === 'function') {
        if (origin && allowedOrigin(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
      }

      if (options.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      const methods = options.methods || defaultMethods;
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));

      const headers = options.allowedHeaders || defaultHeaders;
      res.setHeader('Access-Control-Allow-Headers', headers.join(', '));

      if (options.exposedHeaders) {
        res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '));
      }

      if (options.maxAge) {
        res.setHeader('Access-Control-Max-Age', String(options.maxAge));
      }

      if (req.method === 'OPTIONS') {
        res.statusCode = HttpStatus.NO_CONTENT;
        res.end();
        return;
      }

      next();
    };
  }

  /**
   * Security Headers (Helmet style).
   */
  public static securityHeaders(): MiddlewareHandler {
    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' ws: wss: https:;");
      next();
    };
  }

  /**
   * Rate limiting using in-memory token bucket / sliding window.
   */
  public static rateLimiter(options: {
    windowMs?: number;
    maxRequests?: number;
    message?: string;
    keyGenerator?: (req: CustomHttpRequest) => string;
  } = {}): MiddlewareHandler {
    const windowMs = options.windowMs || 60000; // 1 min default
    const maxRequests = options.maxRequests || 300;
    const message = options.message || 'Too many requests, please slow down.';
    const keyGen = options.keyGenerator || ((req) => req.remoteIp || 'unknown');

    const tracker = new Map<string, { count: number; resetTime: number }>();

    // Cleanup stale entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of tracker.entries()) {
        if (now > record.resetTime) {
          tracker.delete(key);
        }
      }
    }, 300000).unref();

    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      const key = keyGen(req);
      const now = Date.now();
      const current = tracker.get(key);

      if (!current || now > current.resetTime) {
        tracker.set(key, { count: 1, resetTime: now + windowMs });
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
        res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
        next();
        return;
      }

      current.count++;
      const remaining = Math.max(0, maxRequests - current.count);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));

      if (current.count > maxRequests) {
        res.setHeader('Retry-After', Math.ceil((current.resetTime - now) / 1000));
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: message,
            retryAfterSeconds: Math.ceil((current.resetTime - now) / 1000),
          },
        });
        return;
      }

      next();
    };
  }

  /**
   * Parses JSON or URL-encoded body payloads.
   */
  public static bodyParser(options: { maxBodySize?: number } = {}): MiddlewareHandler {
    const maxBodySize = options.maxBodySize || 10 * 1024 * 1024; // 10MB default

    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        req.body = {};
        return next();
      }

      const chunks: Buffer[] = [];
      let totalLength = 0;

      req.on('data', (chunk: Buffer) => {
        totalLength += chunk.length;
        if (totalLength > maxBodySize) {
          res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
            error: {
              code: 'PAYLOAD_TOO_LARGE',
              message: `Payload exceeds limit of ${maxBodySize} bytes`,
            },
          });
          req.destroy();
          return;
        }
        chunks.push(chunk);
      });

      req.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        req.rawBody = rawBuffer;
        const contentType = (req.headers['content-type'] || '').toLowerCase();

        if (rawBuffer.length === 0) {
          req.body = {};
          return next();
        }

        if (contentType.includes('application/json')) {
          try {
            req.body = JSON.parse(rawBuffer.toString('utf-8'));
          } catch (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
              error: {
                code: 'INVALID_JSON',
                message: 'Malformed JSON payload provided in request body',
              },
            });
            return;
          }
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const str = rawBuffer.toString('utf-8');
          const parsed: Record<string, any> = {};
          const searchParams = new URLSearchParams(str);
          for (const [k, v] of searchParams.entries()) {
            parsed[k] = v;
          }
          req.body = parsed;
        } else {
          req.body = rawBuffer;
        }

        next();
      });

      req.on('error', (err) => {
        next(err);
      });
    };
  }

  /**
   * Authentication Guard middleware enforcing role permissions.
   */
  public static requireAuth(roles: string[] = []): MiddlewareHandler {
    return (req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      const user = req.user;
      if (!user) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication token is required to access this endpoint.',
          },
        });
        return;
      }

      if (roles.length > 0 && !roles.includes(user.role) && user.role !== 'admin') {
        res.status(HttpStatus.FORBIDDEN).json({
          error: {
            code: 'FORBIDDEN_ROLE',
            message: `User role '${user.role}' is not authorized. Required: ${roles.join(', ')}`,
          },
        });
        return;
      }

      next();
    };
  }

  /**
   * Global Error Handling Boundary Middleware.
   */
  public static errorHandler(): (err: any, req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => void {
    return (err: any, req: CustomHttpRequest, res: CustomHttpResponse, next: NextFunction) => {
      const isHttpError = err instanceof HttpError;
      const statusCode = isHttpError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorCode = isHttpError ? err.errorCode : 'INTERNAL_SERVER_ERROR';
      const message = err.message || 'An unexpected error occurred on the server.';

      MiddlewareRegistry.logger.error(`Exception handled for ${req.method} ${req.url}: ${message}`, err, {
        requestId: req.id,
        statusCode,
        path: req.url,
      });

      if (!res.writableEnded) {
        res.status(statusCode).json({
          error: {
            code: errorCode,
            message: message,
            details: err.details || undefined,
            stack: ConfigManager.getInstance().isDevelopment ? err.stack : undefined,
          },
        });
      }
    };
  }
}

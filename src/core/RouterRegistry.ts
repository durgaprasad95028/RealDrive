/**
 * ============================================================================
 * REALDRIVE SERVER CORE — ROUTER REGISTRY & RADIX TREE MATCHER
 * ============================================================================
 * High-performance route matching engine supporting:
 * - Dynamic route parameters (:id, :vehicleId, :district)
 * - Wildcard catch-alls (*, ** / *)
 * - Route grouping and nested sub-routers (/api/v1/vehicles/...)
 * - Middleware chaining per-route and per-router
 * - Route discovery and auto-generated API metadata
 */

import {
  CustomHttpRequest,
  CustomHttpResponse,
  HttpMethod,
  MiddlewareHandler,
  NextFunction,
  RouteDefinition,
  RouteHandler,
  HttpStatus,
} from './HttpTypes.js';
import { LoggerService } from './LoggerService.js';

interface RouteNode {
  part: string;
  isParam: boolean;
  paramName?: string;
  isWildcard: boolean;
  children: Map<string, RouteNode>;
  handlers: Map<HttpMethod, { middlewares: MiddlewareHandler[]; action: RouteHandler; definition: RouteDefinition }>;
}

export class RouterRegistry {
  private logger = LoggerService.getInstance().createScopedLogger('Router');
  private rootNode: RouteNode = this.createEmptyNode('');
  private globalMiddlewares: MiddlewareHandler[] = [];
  private prefix: string = '';
  private registeredRoutes: RouteDefinition[] = [];

  constructor(prefix: string = '') {
    this.prefix = this.normalizePath(prefix);
  }

  private createEmptyNode(part: string): RouteNode {
    return {
      part,
      isParam: part.startsWith(':'),
      paramName: part.startsWith(':') ? part.substring(1) : undefined,
      isWildcard: part === '*' || part === '**',
      children: new Map(),
      handlers: new Map(),
    };
  }

  private normalizePath(path: string): string {
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  }

  public use(...middlewares: MiddlewareHandler[]): this {
    this.globalMiddlewares.push(...middlewares);
    return this;
  }

  public route(method: HttpMethod, path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    if (handlers.length === 0) {
      throw new Error(`Route ${method} ${path} must have at least one handler function.`);
    }

    const fullPath = this.normalizePath(this.prefix + this.normalizePath(path));
    const action = handlers[handlers.length - 1] as RouteHandler;
    const middlewares = handlers.slice(0, -1) as MiddlewareHandler[];

    const segments = fullPath.split('/').filter(Boolean);
    let currentNode = this.rootNode;
    const paramNames: string[] = [];

    for (const segment of segments) {
      let isParam = segment.startsWith(':');
      let isWildcard = segment === '*' || segment === '**';
      let key = isParam ? ':param' : (isWildcard ? '*' : segment);

      if (isParam) {
        paramNames.push(segment.substring(1));
      }

      let child = currentNode.children.get(key);
      if (!child) {
        child = this.createEmptyNode(segment);
        currentNode.children.set(key, child);
      }
      currentNode = child;
    }

    // Convert route to regex for validation & documentation
    const regexStr = '^' + fullPath.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)').replace(/\*/g, '.*') + '$';
    const pattern = new RegExp(regexStr);

    const definition: RouteDefinition = {
      method,
      path: fullPath,
      pattern,
      paramNames,
      handlers: [...this.globalMiddlewares, ...middlewares],
      action,
    };

    currentNode.handlers.set(method, {
      middlewares: [...this.globalMiddlewares, ...middlewares],
      action,
      definition,
    });

    this.registeredRoutes.push(definition);
    return this;
  }

  public get(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('GET', path, ...handlers);
  }

  public post(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('POST', path, ...handlers);
  }

  public put(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('PUT', path, ...handlers);
  }

  public patch(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('PATCH', path, ...handlers);
  }

  public delete(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('DELETE', path, ...handlers);
  }

  public options(path: string, ...handlers: [...MiddlewareHandler[], RouteHandler]): this {
    return this.route('OPTIONS', path, ...handlers);
  }

  public mount(prefix: string, subRouter: RouterRegistry): this {
    const cleanPrefix = this.normalizePath(prefix);
    for (const route of subRouter.getRoutes()) {
      const combinedPath = this.normalizePath(cleanPrefix + route.path);
      this.route(
        route.method,
        combinedPath,
        ...route.handlers,
        route.action
      );
    }
    return this;
  }

  public getRoutes(): RouteDefinition[] {
    return [...this.registeredRoutes];
  }

  public match(method: HttpMethod, pathname: string): {
    found: boolean;
    route?: RouteDefinition;
    params: Record<string, string>;
    middlewares: MiddlewareHandler[];
    action?: RouteHandler;
  } {
    const cleanPath = this.normalizePath(pathname);
    const segments = cleanPath.split('/').filter(Boolean);
    const params: Record<string, string> = {};

    let currentNode = this.rootNode;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Exact match
      if (currentNode.children.has(segment)) {
        currentNode = currentNode.children.get(segment)!;
      }
      // Param match (:param)
      else if (currentNode.children.has(':param')) {
        currentNode = currentNode.children.get(':param')!;
        if (currentNode.paramName) {
          params[currentNode.paramName] = decodeURIComponent(segment);
        }
      }
      // Wildcard match (*)
      else if (currentNode.children.has('*')) {
        currentNode = currentNode.children.get('*')!;
        params['wildcard'] = segments.slice(i).join('/');
        break;
      } else {
        return { found: false, params: {}, middlewares: [] };
      }
    }

    const handlerObj = currentNode.handlers.get(method);
    if (!handlerObj) {
      return { found: false, params, middlewares: [] };
    }

    return {
      found: true,
      route: handlerObj.definition,
      params,
      middlewares: handlerObj.middlewares,
      action: handlerObj.action,
    };
  }

  public async handle(req: CustomHttpRequest, res: CustomHttpResponse): Promise<void> {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    req.path = urlObj.pathname;
    req.pathname = urlObj.pathname;

    const query: Record<string, string | string[]> = {};
    for (const [k, v] of urlObj.searchParams.entries()) {
      if (query[k]) {
        if (Array.isArray(query[k])) {
          (query[k] as string[]).push(v);
        } else {
          query[k] = [query[k] as string, v];
        }
      } else {
        query[k] = v;
      }
    }
    req.query = query;

    const matchResult = this.match(req.method as HttpMethod, req.pathname);

    if (!matchResult.found || !matchResult.action) {
      res.status(HttpStatus.NOT_FOUND).json({
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: `Endpoint ${req.method} ${req.pathname} not found on RealDrive backend.`,
        },
      });
      return;
    }

    req.params = matchResult.params;

    // Execute middleware chain followed by final action
    const chain = [...matchResult.middlewares];
    let index = 0;

    const next: NextFunction = async (err?: any) => {
      if (err) {
        throw err;
      }

      if (index < chain.length) {
        const middleware = chain[index++];
        await middleware(req, res, next);
      } else if (matchResult.action) {
        const result = await matchResult.action(req, res);
        if (result !== undefined && !res.writableEnded) {
          res.json(result);
        }
      }
    };

    await next();
  }
}

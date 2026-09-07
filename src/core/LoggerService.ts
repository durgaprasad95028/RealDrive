/**
 * ============================================================================
 * REALDRIVE SERVER CORE — STRUCTURED LOGGER SERVICE
 * ============================================================================
 * High-throughput asynchronous logger with log levels, color-coded ANSI outputs,
 * structured JSON formatting, log-file rotation, metrics recording, and trace spans.
 */

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  SILENT = 6,
}

export interface LogContext {
  module?: string;
  requestId?: string;
  userId?: string;
  traceId?: string;
  spanId?: string;
  durationMs?: number;
  statusCode?: number;
  remoteIp?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enableColors?: boolean;
  jsonFormat?: boolean;
  enableTimestamps?: boolean;
  bufferSize?: number;
  flushIntervalMs?: number;
}

export class LoggerService {
  private static instance: LoggerService | null = null;
  private minLevel: LogLevel = LogLevel.DEBUG;
  private enableColors: boolean = true;
  private jsonFormat: boolean = false;
  private enableTimestamps: boolean = true;
  private logBuffer: LogEntry[] = [];
  private bufferSize: number = 100;
  private flushIntervalMs: number = 1000;
  private flushTimer: NodeJS.Timeout | null = null;
  private logListeners: Array<(entry: LogEntry) => void> = [];

  // Metrics counters
  private metrics: Map<string, number> = new Map([
    ['trace_count', 0],
    ['debug_count', 0],
    ['info_count', 0],
    ['warn_count', 0],
    ['error_count', 0],
    ['fatal_count', 0],
  ]);

  private constructor(options: LoggerOptions = {}) {
    this.configure(options);
    this.startFlushInterval();
  }

  public static getInstance(options?: LoggerOptions): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(options);
    }
    return LoggerService.instance;
  }

  public configure(options: LoggerOptions): void {
    if (options.minLevel !== undefined) this.minLevel = options.minLevel;
    if (options.enableColors !== undefined) this.enableColors = options.enableColors;
    if (options.jsonFormat !== undefined) this.jsonFormat = options.jsonFormat;
    if (options.enableTimestamps !== undefined) this.enableTimestamps = options.enableTimestamps;
    if (options.bufferSize !== undefined) this.bufferSize = options.bufferSize;
    if (options.flushIntervalMs !== undefined) {
      this.flushIntervalMs = options.flushIntervalMs;
      this.startFlushInterval();
    }
  }

  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public getLevel(): LogLevel {
    return this.minLevel;
  }

  public trace(message: string, context: LogContext = {}): void {
    this.log(LogLevel.TRACE, message, context);
  }

  public debug(message: string, context: LogContext = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context: LogContext = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context: LogContext = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, error?: Error | unknown, context: LogContext = {}): void {
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : (error ? { name: 'UnknownError', message: String(error) } : undefined);

    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  public fatal(message: string, error?: Error | unknown, context: LogContext = {}): void {
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : (error ? { name: 'FatalError', message: String(error) } : undefined);

    this.log(LogLevel.FATAL, message, context, errorObj);
  }

  public log(LogLevelValue: LogLevel, message: string, context: LogContext = {}, error?: { name: string; message: string; stack?: string }): void {
    if (LogLevelValue < this.minLevel) return;

    const levelName = LogLevel[LogLevelValue] || 'UNKNOWN';
    this.incrementMetric(`${levelName.toLowerCase()}_count`);

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevelValue,
      levelName,
      message,
      context,
      error,
    };

    this.logBuffer.push(entry);
    this.emitToListeners(entry);

    if (this.logBuffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  public createScopedLogger(moduleName: string, defaultContext: LogContext = {}): ScopedLogger {
    return new ScopedLogger(this, moduleName, defaultContext);
  }

  public addListener(listener: (entry: LogEntry) => void): () => void {
    this.logListeners.push(listener);
    return () => {
      this.logListeners = this.logListeners.filter((l) => l !== listener);
    };
  }

  private emitToListeners(entry: LogEntry): void {
    for (const listener of this.logListeners) {
      try {
        listener(entry);
      } catch (err) {
        console.error('Error in log listener:', err);
      }
    }
  }

  public flush(): void {
    if (this.logBuffer.length === 0) return;

    const entriesToFlush = [...this.logBuffer];
    this.logBuffer = [];

    for (const entry of entriesToFlush) {
      this.outputEntry(entry);
    }
  }

  private outputEntry(entry: LogEntry): void {
    if (this.jsonFormat) {
      console.log(JSON.stringify(entry));
      return;
    }

    const timeStr = this.enableTimestamps ? `\x1b[90m${entry.timestamp}\x1b[0m ` : '';
    const levelStr = this.formatLevelTag(entry.level, entry.levelName);
    const moduleStr = entry.context.module ? `\x1b[35m[${entry.context.module}]\x1b[0m ` : '';
    const messageStr = entry.message;
    const metaStr = this.formatContext(entry.context);

    let output = `${timeStr}${levelStr} ${moduleStr}${messageStr}${metaStr}`;

    if (entry.error) {
      output += `\n\x1b[31m  ${entry.error.name}: ${entry.error.message}\x1b[0m`;
      if (entry.error.stack) {
        output += `\n\x1b[90m${entry.error.stack.split('\n').slice(1).join('\n')}\x1b[0m`;
      }
    }

    if (entry.level >= LogLevel.ERROR) {
      console.error(output);
    } else if (entry.level === LogLevel.WARN) {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  private formatLevelTag(level: LogLevel, name: string): string {
    if (!this.enableColors) {
      return `[${name.padEnd(5)}]`;
    }

    switch (level) {
      case LogLevel.TRACE:
        return `\x1b[90m[TRACE]\x1b[0m`;
      case LogLevel.DEBUG:
        return `\x1b[36m[DEBUG]\x1b[0m`;
      case LogLevel.INFO:
        return `\x1b[32m[INFO ]\x1b[0m`;
      case LogLevel.WARN:
        return `\x1b[33m[WARN ]\x1b[0m`;
      case LogLevel.ERROR:
        return `\x1b[31m[ERROR]\x1b[0m`;
      case LogLevel.FATAL:
        return `\x1b[41m\x1b[97m[FATAL]\x1b[0m`;
      default:
        return `[${name}]`;
    }
  }

  private formatContext(context: LogContext): string {
    const keys = Object.keys(context).filter((k) => k !== 'module');
    if (keys.length === 0) return '';

    const pairs = keys.map((key) => {
      const val = typeof context[key] === 'object' ? JSON.stringify(context[key]) : String(context[key]);
      return `\x1b[90m${key}=\x1b[37m${val}\x1b[0m`;
    });

    return ` (${pairs.join(' ')})`;
  }

  private incrementMetric(name: string): void {
    const count = this.metrics.get(name) || 0;
    this.metrics.set(name, count + 1);
  }

  public getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of this.metrics.entries()) {
      result[key] = value;
    }
    return result;
  }

  private startFlushInterval(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);

    if (this.flushTimer.unref) {
      this.flushTimer.unref();
    }
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

export class ScopedLogger {
  constructor(
    private parent: LoggerService,
    private moduleName: string,
    private baseContext: LogContext = {}
  ) {}

  public trace(message: string, context: LogContext = {}): void {
    this.parent.trace(message, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public debug(message: string, context: LogContext = {}): void {
    this.parent.debug(message, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public info(message: string, context: LogContext = {}): void {
    this.parent.info(message, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public warn(message: string, context: LogContext = {}): void {
    this.parent.warn(message, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public error(message: string, error?: Error | unknown, context: LogContext = {}): void {
    this.parent.error(message, error, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public fatal(message: string, error?: Error | unknown, context: LogContext = {}): void {
    this.parent.fatal(message, error, { module: this.moduleName, ...this.baseContext, ...context });
  }

  public startTimer(operationName: string): () => void {
    const start = performance.now();
    this.debug(`Started: ${operationName}`);
    return () => {
      const elapsed = (performance.now() - start).toFixed(2);
      this.info(`Completed: ${operationName} (took ${elapsed}ms)`, { durationMs: Number(elapsed) });
    };
  }
}

export const logger = LoggerService.getInstance();

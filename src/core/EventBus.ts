/**
 * ============================================================================
 * REALDRIVE SERVER CORE — ASYNCHRONOUS EVENT BUS & PUBSUB
 * ============================================================================
 * High-performance event dispatcher supporting:
 * - Strongly typed simulation, physics, economy, and multiplayer events
 * - Priority-ordered listeners
 * - Asynchronous batching & debounce
 * - Event replay buffer for telemetry stream recovery
 * - Wildcard topic subscriptions (e.g. "vehicle.*", "economy.trade.*")
 */

import { LoggerService } from './LoggerService.js';

export interface EventEnvelope<T = any> {
  id: string;
  topic: string;
  timestamp: number;
  source: string;
  payload: T;
  traceId?: string;
}

export type EventListener<T = any> = (event: EventEnvelope<T>) => void | Promise<void>;

export interface SubscriptionOptions {
  priority?: number; // Higher numbers run first
  once?: boolean;
  filter?: (payload: any) => boolean;
}

interface ListenerRegistration {
  id: string;
  topic: string;
  pattern?: RegExp;
  handler: EventListener;
  priority: number;
  once: boolean;
  filter?: (payload: any) => boolean;
}

export class EventBus {
  private static instance: EventBus | null = null;
  private logger = LoggerService.getInstance().createScopedLogger('EventBus');
  private listeners: Map<string, ListenerRegistration[]> = new Map();
  private wildcardListeners: ListenerRegistration[] = [];
  private eventHistory: EventEnvelope[] = [];
  private maxHistorySize: number = 1000;
  private sequenceCounter: number = 0;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T = any>(
    topic: string,
    handler: EventListener<T>,
    options: SubscriptionOptions = {}
  ): () => void {
    const regId = `sub_${++this.sequenceCounter}_${Date.now()}`;
    const isWildcard = topic.includes('*') || topic.includes('?');

    const reg: ListenerRegistration = {
      id: regId,
      topic,
      priority: options.priority || 10,
      once: !!options.once,
      filter: options.filter,
      handler: handler as EventListener,
    };

    if (isWildcard) {
      const regexStr = '^' + topic.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
      reg.pattern = new RegExp(regexStr);
      this.wildcardListeners.push(reg);
      this.wildcardListeners.sort((a, b) => b.priority - a.priority);
    } else {
      const list = this.listeners.get(topic) || [];
      list.push(reg);
      list.sort((a, b) => b.priority - a.priority);
      this.listeners.set(topic, list);
    }

    return () => this.unsubscribe(regId, topic, isWildcard);
  }

  public once<T = any>(topic: string, handler: EventListener<T>, options: Omit<SubscriptionOptions, 'once'> = {}): () => void {
    return this.subscribe(topic, handler, { ...options, once: true });
  }

  public unsubscribe(registrationId: string, topic?: string, isWildcard?: boolean): void {
    if (isWildcard || !topic) {
      this.wildcardListeners = this.wildcardListeners.filter((l) => l.id !== registrationId);
    }

    if (topic && this.listeners.has(topic)) {
      const filtered = this.listeners.get(topic)!.filter((l) => l.id !== registrationId);
      this.listeners.set(topic, filtered);
    } else if (!topic) {
      for (const [top, list] of this.listeners.entries()) {
        this.listeners.set(top, list.filter((l) => l.id !== registrationId));
      }
    }
  }

  public async emit<T = any>(topic: string, payload: T, source: string = 'system', traceId?: string): Promise<void> {
    const envelope: EventEnvelope<T> = {
      id: `evt_${++this.sequenceCounter}_${Date.now()}`,
      topic,
      timestamp: Date.now(),
      source,
      payload,
      traceId,
    };

    // Store in history buffer
    this.eventHistory.push(envelope);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Direct match listeners
    const direct = this.listeners.get(topic) || [];
    const directToRemove: string[] = [];

    for (const reg of direct) {
      if (reg.filter && !reg.filter(payload)) continue;

      try {
        await reg.handler(envelope);
      } catch (err) {
        this.logger.error(`Error executing event listener for topic "${topic}":`, err, {
          listenerId: reg.id,
          eventId: envelope.id,
        });
      }

      if (reg.once) {
        directToRemove.push(reg.id);
      }
    }

    if (directToRemove.length > 0) {
      this.listeners.set(topic, direct.filter((l) => !directToRemove.includes(l.id)));
    }

    // Wildcard match listeners
    const wildcardsToRemove: string[] = [];
    for (const reg of this.wildcardListeners) {
      if (reg.pattern && reg.pattern.test(topic)) {
        if (reg.filter && !reg.filter(payload)) continue;

        try {
          await reg.handler(envelope);
        } catch (err) {
          this.logger.error(`Error executing wildcard listener for topic "${topic}":`, err, {
            listenerId: reg.id,
            eventId: envelope.id,
          });
        }

        if (reg.once) {
          wildcardsToRemove.push(reg.id);
        }
      }
    }

    if (wildcardsToRemove.length > 0) {
      this.wildcardListeners = this.wildcardListeners.filter((l) => !wildcardsToRemove.includes(l.id));
    }
  }

  public emitSync<T = any>(topic: string, payload: T, source: string = 'system'): void {
    this.emit(topic, payload, source).catch((err) => {
      this.logger.error(`Unhandled exception in emitSync for topic "${topic}":`, err);
    });
  }

  public getHistory(topicPattern?: string, limit: number = 50): EventEnvelope[] {
    let result = [...this.eventHistory];
    if (topicPattern) {
      const reg = new RegExp('^' + topicPattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      result = result.filter((e) => reg.test(e.topic));
    }
    return result.slice(-limit);
  }

  public clear(): void {
    this.listeners.clear();
    this.wildcardListeners = [];
    this.eventHistory = [];
  }
}

export const eventBus = EventBus.getInstance();

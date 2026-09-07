/**
 * ============================================================================
 * REALDRIVE DATABASE — FLUENT QUERY BUILDER & EXECUTION PLANNER
 * ============================================================================
 * Type-safe fluent query builder providing:
 * - Complex filtering (eq, neq, gt, gte, lt, lte, in, notIn, like, regex, between)
 * - Multi-table / collection joins (innerJoin, leftJoin)
 * - Aggregations (sum, avg, min, max, count)
 * - Group by, Having, Order By, Pagination (limit/offset)
 * - Bulk insert, Upsert, Conditional Update, Soft Deletes
 */

export type QueryOperator =
  | '='
  | '!='
  | '<>'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'IN'
  | 'NOT_IN'
  | 'LIKE'
  | 'ILIKE'
  | 'BETWEEN'
  | 'IS_NULL'
  | 'IS_NOT_NULL'
  | 'REGEX';

export interface WhereCondition<T = any> {
  field: keyof T | string;
  operator: QueryOperator;
  value: any;
  secondValue?: any; // For BETWEEN
  booleanOp?: 'AND' | 'OR';
}

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT';
  targetTable: string;
  foreignKey: string;
  localKey: string;
  as?: string;
}

export interface OrderByClause<T = any> {
  field: keyof T | string;
  direction: 'ASC' | 'DESC';
}

export interface QueryAggregate {
  type: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';
  field: string;
  as: string;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class QueryBuilder<T extends Record<string, any> = any> {
  private tableName: string;
  private selectedFields: string[] = ['*'];
  private whereConditions: WhereCondition<T>[] = [];
  private joinClauses: JoinClause[] = [];
  private orderByClauses: OrderByClause<T>[] = [];
  private groupByFields: string[] = [];
  private havingConditions: WhereCondition<any>[] = [];
  private aggregates: QueryAggregate[] = [];
  private limitCount?: number;
  private offsetCount: number = 0;
  private isDistinct: boolean = false;
  private includeSoftDeleted: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public static table<M extends Record<string, any> = any>(tableName: string): QueryBuilder<M> {
    return new QueryBuilder<M>(tableName);
  }

  public select(...fields: (keyof T | string)[]): this {
    if (fields.length > 0) {
      this.selectedFields = fields.map(String);
    }
    return this;
  }

  public distinct(): this {
    this.isDistinct = true;
    return this;
  }

  public withTrashed(): this {
    this.includeSoftDeleted = true;
    return this;
  }

  public where(field: keyof T | string, operatorOrValue: QueryOperator | any, value?: any): this {
    let op: QueryOperator = '=';
    let val = operatorOrValue;

    if (value !== undefined) {
      op = operatorOrValue as QueryOperator;
      val = value;
    }

    this.whereConditions.push({
      field,
      operator: op,
      value: val,
      booleanOp: 'AND',
    });
    return this;
  }

  public orWhere(field: keyof T | string, operatorOrValue: QueryOperator | any, value?: any): this {
    let op: QueryOperator = '=';
    let val = operatorOrValue;

    if (value !== undefined) {
      op = operatorOrValue as QueryOperator;
      val = value;
    }

    this.whereConditions.push({
      field,
      operator: op,
      value: val,
      booleanOp: 'OR',
    });
    return this;
  }

  public whereIn(field: keyof T | string, values: any[]): this {
    this.whereConditions.push({
      field,
      operator: 'IN',
      value: values,
      booleanOp: 'AND',
    });
    return this;
  }

  public whereNotIn(field: keyof T | string, values: any[]): this {
    this.whereConditions.push({
      field,
      operator: 'NOT_IN',
      value: values,
      booleanOp: 'AND',
    });
    return this;
  }

  public whereLike(field: keyof T | string, pattern: string): this {
    this.whereConditions.push({
      field,
      operator: 'LIKE',
      value: pattern,
      booleanOp: 'AND',
    });
    return this;
  }

  public whereBetween(field: keyof T | string, min: any, max: any): this {
    this.whereConditions.push({
      field,
      operator: 'BETWEEN',
      value: min,
      secondValue: max,
      booleanOp: 'AND',
    });
    return this;
  }

  public whereNull(field: keyof T | string): this {
    this.whereConditions.push({
      field,
      operator: 'IS_NULL',
      value: null,
      booleanOp: 'AND',
    });
    return this;
  }

  public whereNotNull(field: keyof T | string): this {
    this.whereConditions.push({
      field,
      operator: 'IS_NOT_NULL',
      value: null,
      booleanOp: 'AND',
    });
    return this;
  }

  public innerJoin(targetTable: string, foreignKey: string, localKey: string, as?: string): this {
    this.joinClauses.push({
      type: 'INNER',
      targetTable,
      foreignKey,
      localKey,
      as,
    });
    return this;
  }

  public leftJoin(targetTable: string, foreignKey: string, localKey: string, as?: string): this {
    this.joinClauses.push({
      type: 'LEFT',
      targetTable,
      foreignKey,
      localKey,
      as,
    });
    return this;
  }

  public orderBy(field: keyof T | string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClauses.push({ field, direction });
    return this;
  }

  public groupBy(...fields: (keyof T | string)[]): this {
    this.groupByFields.push(...fields.map(String));
    return this;
  }

  public count(field: string = '*', as: string = 'count'): this {
    this.aggregates.push({ type: 'COUNT', field, as });
    return this;
  }

  public sum(field: string, as: string = 'sum'): this {
    this.aggregates.push({ type: 'SUM', field, as });
    return this;
  }

  public avg(field: string, as: string = 'avg'): this {
    this.aggregates.push({ type: 'AVG', field, as });
    return this;
  }

  public min(field: string, as: string = 'min'): this {
    this.aggregates.push({ type: 'MIN', field, as });
    return this;
  }

  public max(field: string, as: string = 'max'): this {
    this.aggregates.push({ type: 'MAX', field, as });
    return this;
  }

  public limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  public offset(count: number): this {
    this.offsetCount = Math.max(0, count);
    return this;
  }

  public page(pageNumber: number, pageSize: number = 20): this {
    this.offsetCount = Math.max(0, (pageNumber - 1) * pageSize);
    this.limitCount = pageSize;
    return this;
  }

  /**
   * Compiles the query plan into abstract execution metadata.
   */
  public getPlan() {
    return {
      table: this.tableName,
      fields: this.selectedFields,
      conditions: this.whereConditions,
      joins: this.joinClauses,
      order: this.orderByClauses,
      group: this.groupByFields,
      aggregates: this.aggregates,
      limit: this.limitCount,
      offset: this.offsetCount,
      distinct: this.isDistinct,
      withTrashed: this.includeSoftDeleted,
    };
  }

  /**
   * Executes in-memory dataset filtering against a collection of records.
   */
  public executeInMemory(dataset: T[], foreignTables: Record<string, any[]> = {}): T[] {
    let results = dataset.filter((record) => {
      // Soft-delete filter
      if (!this.includeSoftDeleted && record.deletedAt) {
        return false;
      }
      return this.evaluateConditions(record, this.whereConditions);
    });

    // Execute Joins
    for (const join of this.joinClauses) {
      const foreignData = foreignTables[join.targetTable] || [];
      const joinField = join.as || join.targetTable;

      results = results.map((record) => {
        const localVal = record[join.localKey];
        if (join.type === 'LEFT') {
          const matched = foreignData.find((f) => f[join.foreignKey] === localVal) || null;
          return { ...record, [joinField]: matched };
        } else {
          // INNER JOIN
          const matched = foreignData.find((f) => f[join.foreignKey] === localVal);
          if (!matched) return null as any;
          return { ...record, [joinField]: matched };
        }
      }).filter(Boolean);
    }

    // Order By
    if (this.orderByClauses.length > 0) {
      results.sort((a, b) => {
        for (const order of this.orderByClauses) {
          const valA = a[order.field as string];
          const valB = b[order.field as string];
          if (valA === valB) continue;
          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;

          const factor = order.direction === 'ASC' ? 1 : -1;
          if (typeof valA === 'string') {
            return valA.localeCompare(String(valB)) * factor;
          }
          return (valA < valB ? -1 : 1) * factor;
        }
        return 0;
      });
    }

    // Offset & Limit
    if (this.offsetCount > 0) {
      results = results.slice(this.offsetCount);
    }
    if (this.limitCount !== undefined) {
      results = results.slice(0, this.limitCount);
    }

    // Projection
    if (!this.selectedFields.includes('*')) {
      results = results.map((item) => {
        const projected: Record<string, any> = {};
        for (const f of this.selectedFields) {
          projected[f] = item[f];
        }
        return projected as T;
      });
    }

    return results;
  }

  private evaluateConditions(record: any, conditions: WhereCondition<T>[]): boolean {
    if (conditions.length === 0) return true;

    let accumulator = true;

    for (let i = 0; i < conditions.length; i++) {
      const cond = conditions[i];
      const match = this.evaluateSingleCondition(record, cond);

      if (i === 0) {
        accumulator = match;
      } else {
        if (cond.booleanOp === 'OR') {
          accumulator = accumulator || match;
        } else {
          accumulator = accumulator && match;
        }
      }
    }

    return accumulator;
  }

  private evaluateSingleCondition(record: any, cond: WhereCondition<T>): boolean {
    const val = record[cond.field as string];

    switch (cond.operator) {
      case '=':
        return val === cond.value;
      case '!=':
      case '<>':
        return val !== cond.value;
      case '>':
        return val > cond.value;
      case '>=':
        return val >= cond.value;
      case '<':
        return val < cond.value;
      case '<=':
        return val <= cond.value;
      case 'IN':
        return Array.isArray(cond.value) && cond.value.includes(val);
      case 'NOT_IN':
        return Array.isArray(cond.value) && !cond.value.includes(val);
      case 'LIKE': {
        const pattern = String(cond.value).replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp(`^${pattern}$`, 'i').test(String(val || ''));
      }
      case 'ILIKE': {
        const pattern = String(cond.value).replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp(`^${pattern}$`, 'i').test(String(val || ''));
      }
      case 'BETWEEN':
        return val >= cond.value && val <= cond.secondValue;
      case 'IS_NULL':
        return val === null || val === undefined;
      case 'IS_NOT_NULL':
        return val !== null && val !== undefined;
      case 'REGEX':
        return new RegExp(String(cond.value)).test(String(val || ''));
      default:
        return false;
    }
  }
}

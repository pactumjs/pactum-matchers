export * as utils from './utils';

interface EachLikeOptions {
  min?: number;
  value?: any;
}

/**
 * type matching
 */
export function like(value: any): object;

/**
 * array type matching 
 */
export function eachLike(content: any, options?: EachLikeOptions): object;

/**
 * oneOf matching
 */
export function oneOf(value: any): object;

/**
 * expression matching
 */
export function expression(value: any, expr: string): object;

/**
 * non empty string matching
 */
 export function string(value?: string): object;

/**
 * regex matching
 */
export function regex(value: any, matcher: RegExp): object;
export function regex(value: any, matcher: string): object;

/**
 * partial regex matching
 */
export function includes(value: string | number): object;

/**
 * email matching
 */
export function email(value?: string): object;

/**
 * uuid matching
 */
export function uuid(value?: string): object;

/**
 * ISO 8601 date matching
 */
export function date(value?: string): object;

/**
 * ISO 8601 date-time matching
 */
export function dateTime(value?: string): object;
import { DataType } from "./Enum";

/**
 * Indicates if given value is undefined
 *
 * @param {any} val
 * @return {boolean}
 */
export function isUndefined(val) {
  return typeof val === DataType.UNDEFINED;
}

/**
 * Indicates if given value is a function
 *
 * @param {any} val
 * @return {boolean}
 */
export function isFunction(val) {
  return typeof val === DataType.FUNCTION;
}

/**
 * Indicates if given value is a non-empty string
 *
 * @param {any} val
 * @return {boolean}
 */
export function isString(val) {
  return !!val && typeof val === DataType.STRING;
}

/**
 * Indicates if given value is a array
 *
 * @param {any} val
 * @return {boolean}
 */
export function isArray(val) {
  return !!val && Array.isArray(val);
}

/**
 * Indicates if given value is a object
 *
 * @param {any} val
 * @return {boolean}
 */
export function isObject(val) {
  return !!val && Object.prototype.toString.call(val) === "[object Object]";
}

/**
 * Generate uuid
 * @returns {string}
 */
export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

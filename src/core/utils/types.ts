function isArr(arr: unknown): boolean {
  return Array.isArray(arr);
}

function isStr(str: unknown): boolean {
  return typeof str === 'string';
}

function isNum(num: unknown): boolean {
  return typeof num === 'number';
}

function isFunc(func: unknown): boolean {
  return typeof func === 'function';
}

function isNull(value: unknown): boolean {
  return typeof value === null;
}

function isObject(item: any): boolean {
  if (!isArr(item) && !isNull(item)) {
    return typeof item === 'object';
  }
  return false;
}

export {isArr, isStr, isNum, isFunc, isObject};

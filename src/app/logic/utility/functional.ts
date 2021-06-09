import { mapOption } from 'fp-ts/lib/Array';
import { OptionMap } from './optionalmap';
import { none, Option, some } from 'fp-ts/lib/Option';

export function mapToOptionMap<T, K, V>(
  array: Array<T>,
  func: (T) => [K, V]
): OptionMap<K, V> {
  const retMap = new OptionMap<K, V>();
  array.forEach((elem) => {
    const [key, value] = func(elem);
    retMap.set(key, value);
  });
  return retMap;
}

export function block<T, W>(
  value?: T
// tslint:disable-next-line:variable-name
): { let: (func: (value: T) => W, _else?: () => W) => W } {
  return {
    let:
      value !== null && value !== undefined
        // tslint:disable-next-line:variable-name
        ? (func: (value: T) => W, _else?: () => W) => func(value)
        // tslint:disable-next-line:variable-name
        : (func: (value: T) => W, _else?: () => W) => {
            return _else !== null ? _else() : (() => null as W)();
          },
  };
}

export function ifblock<W>(
  condition: boolean
// tslint:disable-next-line:variable-name
): { let: (_do: () => W, _else: () => W) => W } {
  return {
    let:
      condition === true
        // tslint:disable-next-line:variable-name
        ? (_do: () => W, _else: () => W) => _do()
        // tslint:disable-next-line:variable-name
        : (_do: () => W, _else?: () => W) => {
            return _else();
          },
  };
}

export function mapNotNone<T, W>(array: Array<T>, func: (T) => Option<W>): Array<W> {
    return mapOption(array, func);
  }

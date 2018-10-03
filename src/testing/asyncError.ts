import { defer } from 'rxjs';

/** Create async observable error that errors
 *  after a JS engine turn */
export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

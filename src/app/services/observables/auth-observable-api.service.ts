import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

/**
 * Auth API service.
 * 'Fake Object': pretends to be a wrapper around real calls to a remote service.
 *
 * we will stub this service for testing purposes.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthObservableApiService {

  public static delay = 500;
  private _loggedUser: string; // simulates holding the state (the last logged in user)

  /**
   * a function that performs the login and return some logged user informations.
   * @param username the username
   * @param password the password
   */
  public login(username: string, password: string): Observable<string> {
    return defer(() => Promise.resolve(username))
      .pipe(
        delay(AuthObservableApiService.delay),
        tap(() => this._loggedUser = username)
      );
  }

  public logout(): Observable<boolean> {
    return defer(() => Promise.resolve(true))
      .pipe(
        delay(AuthObservableApiService.delay),
        tap(() => this._loggedUser = null)
      );
  }

  public getLoggedUser(): Observable<string> {
    return defer(() => Promise.resolve(this._loggedUser))
      .pipe(
        delay(AuthObservableApiService.delay)
      );
  }
}

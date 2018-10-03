import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthObservableApiService } from './auth-observable-api.service';
import { take } from 'rxjs/operators';

/**
 * "Observable-oriented" auth service implementation
 */
@Injectable({
  providedIn: 'root'
})
export class AuthObservableService {

  private _loggedUser$ = new BehaviorSubject<string>(null); // new Subject();
  public get loggedUser$(): Observable<string> {
    return this._loggedUser$.asObservable();
  }

  constructor(
    private authObservableApiService: AuthObservableApiService
  ) { }

  public login(username: string, password: string) {
    this.authObservableApiService.login(username, password)
      .pipe(
        take(1)
      )
      .subscribe(result => {
        this._loggedUser$.next(result);
      });
  }

  public logout() {
    this.authObservableApiService.logout()
      .pipe(
        take(1)
      )
      .subscribe(result => {
        if (result) {
          this._loggedUser$.next(null);
        }
      });
  }

  /**
   * currently logged user snapshot
   *
   * @readonly
   * @type {string}
   * @memberof AuthObservableService
   */
  public get getLoggedUser(): string {
    return this._loggedUser$.getValue();
  }
}

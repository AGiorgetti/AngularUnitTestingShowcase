import { Injectable } from '@angular/core';

/**
 * Auth API service.
 * 'Fake Object': pretends to be a wrapper around real calls to a remote service.
 *
 * we will stub this service for testing purposes.
 */
@Injectable()
export class AuthApiService {

  public static delay = 500;

  private _loggedUser: string; // simulates a remote service holding the state

  constructor() { }

  public login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._loggedUser = username;
        resolve(true);
      }, AuthApiService.delay);
    });
  }

  public logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._loggedUser = '';
        resolve(true);
      }, AuthApiService.delay);
    });
  }

  public getLoggedUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this._loggedUser);
      }, AuthApiService.delay);
    });
  }

}

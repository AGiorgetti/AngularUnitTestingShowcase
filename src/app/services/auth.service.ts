import { Injectable } from '@angular/core';
import { AuthApiService } from "app/services/auth-api.service";

@Injectable()
export class AuthService {

  private _isLoggedIn = false
  public get isLoggedIn() {
    return this._isLoggedIn;
  }

  private _username = "";
  public get username() {
    return this._username;
  }

  constructor(
    private _authApi: AuthApiService
  ) { }

  // Synchronous calls, they do not use a remote service, used to show sync testing features

  public login(username: string, password: string): boolean {
    this._username = username;
    this._isLoggedIn = true;
    return true;
  }

  public logout(): boolean {
    this._username = "";
    this._isLoggedIn = false;
    return true;
  }

  public getLoggedUser(): string {
    return this.username;
  }

  // Asynchronous calls, they use a remote service, used to show stubs and async testing features

  /* with Promise, less readable than async/await
  public loginAsync(username: string, password: string): Promise<boolean> {
    return this._authApi.login(username, password)
      .then(result => {
        if (result === true) {
          this._isLoggedIn = true;
          this._username = username;
        }
        return result;
      });
  }

  public logoutAsync(): Promise<boolean> {
    return this._authApi.logout()
      .then(result => {
        if (result === true) {
          this._username = "";
          this._isLoggedIn = false;
        }
        return result;
      });
  }

  public getLoggedUserAsync(): Promise<string> {
    return this._authApi.getLoggedUser()
      .then(result => {
        this._username = result;
        this._isLoggedIn = result != null && result !== "";
        return result;
      });
  }

  */

  public async loginAsync(username: string, password: string): Promise<boolean> {
    const result = await this._authApi.login(username, password)
    if (result === true) {
      this._isLoggedIn = true;
      this._username = username;
    }
    return result;
  }
  public async logoutAsync(): Promise<boolean> {
    const result = await this._authApi.logout();
    if (result === true) {
      this._username = "";
      this._isLoggedIn = false;
    }
    return result;
  }

  public async getLoggedUserAsync(): Promise<string> {
    const result = await this._authApi.getLoggedUser();
    this._username = result;
    this._isLoggedIn = result != null && result !== "";
    return result;
  }

}

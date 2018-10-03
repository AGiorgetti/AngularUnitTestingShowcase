import { AuthApiService } from "../../services/auth-api.service";
import { AuthService } from "../../services/auth.service";

// Jasmine can also mix both approaches:
// - create a stub object.
// - augment it using a spy to trace the function calls.

describe('04 - Pure Test - spyOn a stub object.', () => {

  let authApiServiceStub: AuthApiService;
  let sut: AuthService;
  let loginSpy: jasmine.Spy;

  beforeEach(() => {
    // create a stub object, we can control the test implementing its behavior on the fly
    authApiServiceStub = <AuthApiService>{};
    authApiServiceStub.login = (username: string, password: string) => Promise.resolve(true);

    // add a Spy
    loginSpy = spyOn(authApiServiceStub, "login")
      .and.callThrough();

    sut = new AuthService(authApiServiceStub);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should have noone logged in', () => {
    expect(sut.isLoggedIn).toBeFalsy();
  });

  // intrument using a 'Spy' and delegate to the original function code
  it("should login a user", async (done) => {
    const result = await sut.loginAsync("Alessandro", "12345");
    expect(loginSpy.calls.count()).toBe(1);
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // call done when all your expectation are verified!
    done();
  });

  // Change behavior using a 'Spy'
  it("should have no logged user if login fails", async (done) => {
    // always fail the login procedure
    // change the behavior of the stub object to match the test
    authApiServiceStub.login = (username: string, password: string) => Promise.resolve(false);
    // if we change the function, we need to reinstall the spy.
    loginSpy = spyOn(authApiServiceStub, "login")
      .and.callThrough();

    const result = await sut.loginAsync("Alessandro", "12345");
    expect(loginSpy.calls.count()).toBe(1);
    expect(result).toBeFalsy();
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

  it("should have no logged user if the http call fails (fake)", async (done) => {
    // always fail the login procedure (this changes the service behavior)
    authApiServiceStub.login = (username: string, password: string) => { throw new Error("http error!"); };
    // I changed the function, I need to reinstall the spy.
    loginSpy = spyOn(authApiServiceStub, "login")
      .and.callThrough();

    try {
      const result = await sut.loginAsync("Alessandro", "12345");
    } catch (e) {
      expect((e as Error).message).toBe("http error!");
    }
    expect(loginSpy.calls.count()).toBe(1);
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

});

// Jasmine can also mix both approaches:
// - create a spy stub object: all the functions are implementes ad spies that you can inspect or change

describe('04 - Pure Test - a spy stub object!', () => {

  // a spy is also a function defined as: (...params: any[]): any;
  // we can use it to implement any function.
  class AuthApiServiceStub  {
    private _loggedUser: string;
    login = jasmine.createSpy("login").and.callFake(() => Promise.resolve(true));
    logout = jasmine.createSpy("logout").and.callFake(() => Promise.resolve(true));
    getLoggedUser = jasmine.createSpy("getLoggedUser").and.callFake(() => "Alessandro");
  }

  let sut: AuthService;
  let authApiServiceStub: AuthApiServiceStub;

  beforeEach(() => {
    // create a stub object, we can control the test implementing its behavior on the fly
    authApiServiceStub = new AuthApiServiceStub();

    // we don't have proper dependency injection here and the object might not be fully
    // compatible, let's give up type safety.
    sut = new AuthService(authApiServiceStub as any);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should have noone logged in', () => {
    expect(sut.isLoggedIn).toBeFalsy();
  });

  // intrument using a 'Spy' and delegate to the original function code
  it("should login a user", async (done) => {
    const result = await sut.loginAsync("Alessandro", "12345");
    expect(authApiServiceStub.login.calls.count()).toBe(1);
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // call done when all your expectation are verified!
    done();
  });

  // Change behavior using a 'Spy'
  it("should have no logged user if login fails", async (done) => {
    // always fail the login procedure
    // change the behavior of the stub object to match the test
    authApiServiceStub.login.and.callFake((username: string, password: string) => Promise.resolve(false));

    const result = await sut.loginAsync("Alessandro", "12345");
    expect(authApiServiceStub.login.calls.count()).toBe(1);
    expect(result).toBeFalsy();
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

  it("should have no logged user if the http call fails (fake)", async (done) => {
    // always fail the login procedure (this changes the service behavior)
    authApiServiceStub.login.and.callFake((username: string, password: string) => { throw new Error("http error!"); });

    try {
      const result = await sut.loginAsync("Alessandro", "12345");
    } catch (e) {
      expect((e as Error).message).toBe("http error!");
    }
    expect(authApiServiceStub.login.calls.count()).toBe(1);
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

});

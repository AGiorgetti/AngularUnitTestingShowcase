import { AuthService } from "app/services/auth.service";
import { inject } from "@angular/core/testing";
import { AuthApiService } from "app/services/auth-api.service";

// Use Jasmine to setup and execute Pure Unit Tests

// What if our system under test has some dependencies ?
// Using the 'Real Services' is always a problem, we need to provide Test Doubles.

// Provide a Spy, this way we can control the testing environment and
// check the component in isolation.
//
// Use Jasmine 'spyOn' to instrument and change the behavior of the real object.
// We can also use it to check for expectations.
describe('02 - Pure Test - spyOn - AuthApiService', () => {

  let authApiService: AuthApiService;
  let sut: AuthService;
  let loginSpy: jasmine.Spy;

  beforeEach(() => {
    authApiService = new AuthApiService();
    sut = new AuthService(authApiService);

    // a spy can be used to provide canned return values to function calls.
    loginSpy = spyOn(authApiService, "login");
    // .and.callThrough(); // instrument and delegate to the original function
    // .and.returnValue(false); // provide a return value, can also provide custom behavior with 'callFake'
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should have noone logged in', () => {
    expect(sut.isLoggedIn).toBeFalsy();
  });

  // intrument using a 'Spy' and delegate to the original function code
  it("should login a user", async (done) => {
    // delegate the actual call to the original function
    loginSpy.and.callThrough();

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
    // always fail the login procedure (this changes the service behavior)
    loginSpy.and.returnValue(false);

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
    loginSpy.and.callFake((username: string, password: string) => { throw new Error("http error!") });
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

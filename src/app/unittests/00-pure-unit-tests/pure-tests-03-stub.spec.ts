import { inject } from "@angular/core/testing";
import { AuthApiService } from "../../services/auth-api.service";
import { AuthService } from "../../services/auth.service";

// Use Jasmine to setup and execute Pure Unit Tests

// What if our system under test has some dependencies ?
// Using the 'Real Services' is always a problem, we need to provide Test Doubles.

// Provide a Stub object (that implements the same interface of the original object)
// this way we can control the testing environment and test the component in isolation.
// It has the advantage of reducing the total number of dependencies of the unit.
describe('03 - Pure Test - using a Stub object', () => {

  let authApiServiceStub: AuthApiService;
  let sut: AuthService;

  beforeEach(() => {
    // create a stub object, we can control the test implementing / changing its behavior on the fly.
    // we also have TypeScript to help us here (in case of refactoring).
    authApiServiceStub = <AuthApiService>{};
    authApiServiceStub.login = (username: string, password: string) => Promise.resolve(true);

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
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // call done when all your expectation are verified!
    done();
  });

  // Change behavior using a 'Spy'
  it("should have no logged user if login fails", async (done) => {
    // always fail the login procedure (this changes the service behavior)
    // change the behavior of the stub object to match the test
    authApiServiceStub.login = (username: string, password: string) => Promise.resolve(false);

    const result = await sut.loginAsync("Alessandro", "12345");
    expect(result).toBeFalsy();
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

  it("should have no logged user if the http call fails (fake)", async (done) => {
    // always fail the login procedure (this changes the service behavior)
    authApiServiceStub.login = (username: string, password: string) => { throw new Error("http error!"); };
    try {
      const result = await sut.loginAsync("Alessandro", "12345");
    } catch (e) {
      expect((e as Error).message).toBe("http error!");
    }
    expect(sut.isLoggedIn).toBeFalsy();
    expect(sut.username).toBe("");
    // call done when all your expectation are verified!
    done();
  });

});

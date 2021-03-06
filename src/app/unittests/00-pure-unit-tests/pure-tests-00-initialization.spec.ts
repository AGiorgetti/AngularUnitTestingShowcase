import { inject } from "@angular/core/testing";
import { AuthService } from "../../services/auth.service";
import { AuthApiService } from "../../services/auth-api.service";

// Use Jasmine to setup and execute Pure Unit Tests

// Keep the things simple: no complex initialization, dependency injection and such,
// just create each object by hand.

// Jasmine uses describe() to setup a test suite
describe('00 - Pure Test - Init - AuthService', () => {
  let sut: AuthService;

  // Jasmine runs the beforEach() functions before each test.
  // It resets the configuration before each test, it will provide us
  // with a clean environment every time.
  // We can have more than one beforeEach() in a test suite, they will be executed in the correct order.
  beforeEach(() => {
    // no dependency injection: create everything with constructors
    sut = new AuthService(new AuthApiService);
  });

  // Jasmine uses 'it()' to define a single test case.
  it('should be created', () => {
    // expect() is used to verify expectations.
    expect(sut).toBeTruthy();
  });

  // let's see some synchronous testing capabilities (no remote service involved)
  it('should have noone logged in', () => {
    expect(sut.isLoggedIn).toBeFalsy();
  });

  it("should login a user", () => {
    sut.login("Alessandro", "12345");
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
  });
});

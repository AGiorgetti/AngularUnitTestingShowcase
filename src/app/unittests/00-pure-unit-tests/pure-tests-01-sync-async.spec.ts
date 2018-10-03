import { inject } from "@angular/core/testing";
import { AuthService } from "../../services/auth.service";
import { AuthApiService } from "../../services/auth-api.service";

// Use Jasmine to setup and execute Pure Unit Tests

// Sync and Async testing with Jasmine

describe('01 - Pure Test - Sync/Async - AuthService', () => {

  let sut: AuthService;

  beforeEach(() => {
    sut = new AuthService(new AuthApiService());
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  // Synchronous Tests: they just use an in memory implementation.

  it('should have noone logged in', () => {
    expect(sut.isLoggedIn).toBeFalsy();
  });

  // Sync Test
  it("should login a user", () => {
    sut.login("Alessandro", "12345");
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
  });

  // Asynchronous Tests: they use a remote service

  /* UNCOMMENT THIS TO SEE THE ERROR

  // Async Test, without a done() function call Jasmine will not wait for the async
  // operations to complete and will show the test as successful even if no expectation
  // were checked
  it("(no expectations are verified!) should login a user", () => {
    sut.loginAsync("Alessandro", "12345")
      .then(result => {
        expect(result).toBeTruthy();
        expect(sut.isLoggedIn).toBeTruthy();
        expect(sut.username).toBe("Alessandro");
      });
  });
  */

  // Async Test: Jasmine will wait for a done() function call that will mark
  // all the async test operation as completed.
  it("(done()) should login a user", (done) => {
    sut.loginAsync("Alessandro", "12345")
      .then(result => {
        expect(result).toBeTruthy();
        expect(sut.isLoggedIn).toBeTruthy();
        expect(sut.username).toBe("Alessandro");
        // call done when all your expectation are verified!
        done();
      });
  });

  // Async Test, make it more readable with async/await;
  // the function is still async, and we still might to call done().
  it("(async/await) should login a user", async (done) => {
    const result = await sut.loginAsync("Alessandro", "12345");
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // call done when all your expectation are verified!
    done();
  });

  // Async Test, make it more readable with async/await.
  it("(async/await, no done()) should login a user", async () => {
    const result = await sut.loginAsync("Alessandro", "12345");
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // call done when all your expectation are verified!
    // done();
  });

});

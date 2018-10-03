import { inject } from "@angular/core/testing";
import { async } from "@angular/core/testing";
import { fakeAsync } from "@angular/core/testing";
import { tick } from "@angular/core/testing";
import { discardPeriodicTasks } from "@angular/core/testing";
import { AuthApiService } from "../../services/auth-api.service";
import { AuthService } from "../../services/auth.service";

// Take advantage of Angular Testing Utilities to write async tests:
// async()
// fakeAsync() + tick()

describe('05 - Pure Test - async() Angular Testing Utilities - AuthService', () => {

  let authApiService: AuthApiService;
  let sut: AuthService;

  beforeEach(() => {
    authApiService = new AuthApiService();
    sut = new AuthService(authApiService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  // Asynchronous Tests: they use a remote service

  // async() will call jasmine done() function for us when all the async operation
  // started in the async zone completed themselves.
  it("(async()) should login a user", async(() => {
    sut.loginAsync("Alessandro", "12345")
      .then(result => {
        expect(result).toBeTruthy();
        expect(sut.isLoggedIn).toBeTruthy();
        expect(sut.username).toBe("Alessandro");
      });
  }));

  // Async Test, make it more readable with async/await
  // the function is still async.
  it("(async() + async/await) should login a user", async(async () => {
    const result = await sut.loginAsync("Alessandro", "12345");
    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
  }));

  /* WARNING: there are still some problems with fakeAsync() and setTimeout / intervalTimer */

  it("(fakeAsync()) should login a user", fakeAsync(() => {
    // Comment the spyOn to see the error, the function uses a timer!
    spyOn(authApiService, "login")
      .and.returnValue(true);

    let result: boolean;
    sut.loginAsync("Alessandro", "12345")
      .then(res => result = res);

    tick();

    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
  }));

  // sometimes a test can end with pending timer event tasks (queued by setTimeout() or setInterval())
  // it will be reported with an error like: "Error: 1 timer(s) still in the queue.""
  // we can avoid the error message calling "discardPeriodicTasks()".

  // fakeAsync() + tick() allows us to write async tests in a more linear coding style: the tests appear to be synchronous.
  // WARNING: cannot make XHR calls inside a fakeAsync zone!
  it("(fakeAsync(), no spyOn) should login a user", fakeAsync(() => {
    let result: boolean;
    sut.loginAsync("Alessandro", "12345")
      .then(res => result = res);

    // tick() simulates the asynchronous passage of time.
    tick(500); // the functions inside the async call have a 500 ms delay before completing

    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");
    // discardPeriodicTasks();
  }));

  // there are still some problems with fakeAsync and async/await
  /*
  it("(fakeAsync(), no spyOn, async/await) should login a user", fakeAsync(async() => {
    const result = await sut.loginAsync("Alessandro", "12345");

    // simulates the asynchronous passage of time
    tick(500); // the functions inside the async call have a 500 ms delay before completing

    expect(result).toBeTruthy();
    expect(sut.isLoggedIn).toBeTruthy();
    expect(sut.username).toBe("Alessandro");

    // discardPeriodicTasks();
  }));
  */

});

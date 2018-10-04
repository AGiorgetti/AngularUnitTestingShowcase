/**
 * Shows how to test a Component with a Dependency using async functions
 *
 * Angular testing Utilities (async, fakeAsync) can also be used to test services too
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from "@angular/platform-browser";
import { fakeAsync } from "@angular/core/testing";
import { tick } from "@angular/core/testing";
import { inject } from "@angular/core/testing";
import { GreetingsAsyncComponent } from '../../components/greetings-async/greetings-async.component';
import { AuthService } from '../../services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

// What if our component interact with an internal service with async functions ?
// Let's see how to properly test when waiting for services to provide the data to the component.

describe('03 - Angular Tests - with dep. Async - GreetingsAsyncComponent', () => {
  let component: GreetingsAsyncComponent;
  let fixture: ComponentFixture<GreetingsAsyncComponent>;

  let authService: AuthService;
  let getLoggedUserAsyncSpy: jasmine.Spy;
  let el: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingsAsyncComponent],
      providers: [AuthApiService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingsAsyncComponent);
    component = fixture.componentInstance;

    authService = fixture.debugElement.injector.get(AuthService);

    // add a spy that provides the test with the proper initialization
    // we simulate having a user already authenticated, the server have to provide the
    // data.
    getLoggedUserAsyncSpy = spyOn(authService, "getLoggedUserAsync")
      .and.returnValue(Promise.resolve("Alessandro"));
      // .and.callThrough();
      // delegating to functions with timers might create problems to Angular testing utilities

    el = fixture.debugElement.query(By.css("h3")).nativeElement;

    // will call this in the actual tests, to check for initialized state
    // fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not show greetings before OnInit', () => {
    // no change detection
    expect(el.textContent).toBe('', 'nothing displayed');
    expect(getLoggedUserAsyncSpy.calls.any()).toBe(false, 'getLoggedUserAsync not yet called');
  });

  // synchronous test! we do not wait for the service to provide its data
  it('should not show quote after component initialize (sync)', () => {
    // force change detecion, calls ngOnInit
    fixture.detectChanges();
    // getLoggedUserAsync is async => it has not returned any data yet
    expect(el.textContent).toBe('...', 'no greetings yet');
    expect(getLoggedUserAsyncSpy.calls.any()).toBe(true, 'getLoggedUserAsync called');
  });

  // async() - Angular Testing Utility function
  it('should show greetings after getLoggedUserAsync promise (async)', async(() => {
    // force change detection, calls ngOnInit
    fixture.detectChanges();

    // wait for the async function to complete (async test zone)
    fixture.whenStable()
      .then(() => {
        // force a change detection to update the view (the tests does not do it automatically)
        fixture.detectChanges();
        expect(el.textContent).toBe("Welcome, Alessandro");
      });
  }));

  // fakeAsync() - Angular Testing Utility function
  // WARNING: cannot make XHR calls inside a fakeAsync()
  it('should show greetings after getLoggedUserAsync promise (fakeAsync)', fakeAsync(() => {
    // force change detection, calls ngOnInit
    fixture.detectChanges();
    // wait for the async functions to complete (fake async zone)
    tick(); // use tick(500) when you set .and.callThrough() on the getLoggedUserAsyncSpy Spy.
    // force a change detection to update the view (the tests does not do it automatically)
    fixture.detectChanges();
    expect(el.textContent).toBe("Welcome, Alessandro");
  }));

  // sometimes we need to use the traditional jasmine way to do async tests
  // especially considering there may be problems with timers and xhr calls
  it('should show greetings after getLoggedUserAsync promise (jasmine)', done => {
    // force change detection, calls ngOnInit
    fixture.detectChanges();
    // use the spy to be notified when the inner function call ends
    getLoggedUserAsyncSpy.calls.mostRecent().returnValue
      .then(() => {
        // force a change detection to update the view (the tests does not do it automatically)
        fixture.detectChanges();
        expect(el.textContent).toBe("Welcome, Alessandro");
        done();
      });
  });

  // async() and fackeAsync() can be used to tests services too.
  // we saw it in the "pure unit tests" section

  it('AuthService should return the logged user username', async(inject([AuthService], async (service) => {
    const loggedUser = await service.getLoggedUserAsync();
    expect(loggedUser).toBe("Alessandro");
  })));

});

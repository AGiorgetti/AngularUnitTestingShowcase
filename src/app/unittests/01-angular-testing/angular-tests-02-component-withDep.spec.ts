/**
 * Shows how to Test a Component with a Dependency
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { inject } from "@angular/core/testing";
import { GreetingsComponent } from '../../components/greetings/greetings.component';
import { AuthService } from '../../services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

// Use a STUB OBJECT

// Provide a Test Double for the injected service, 2 approaches:
// - Stub: provide a stub object.
// - Spy the real service: provide the real implementation of the service and stub its behavior with 'spyOn'.
//
// However always get the service from an Injector
// do not use the instance of the stub inside the tests anymore: the instance that will be injected in the
// component is a clone - something different - of this object!
// - This object can be used to configure the service until it's injected in the SUT.
// - If you want to change properties of the injected object, you'll need to get
//   a reference to the injected service using an injector!
describe('02 - Angular Tests - with dep. - GreetingsComponent - Stub Injected Service', () => {
  let component: GreetingsComponent;
  let fixture: ComponentFixture<GreetingsComponent>;

  // the stub definition object
  const authServiceStub = <AuthService>{
    isLoggedIn: false
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingsComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  }));

  /* You can change the stub properties and values until the first instance of that
     object is provided to someone.

  beforeEach(() => {
    authServiceStub.isLoggedIn = true;
    authServiceStub.username = "Giorgetti";
  })
  */

  // creates an instance of the component for each test
  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingsComponent);
    component = fixture.componentInstance;
    // A good idea is avoid calling the detectChanges() automatically,
    // we have a chance to interact with the services before the bindings are evaluated
    // fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it("should display 'please log in' if the user is not authenticated", () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css("h3")).nativeElement;
    expect(el.textContent).toBe("please log in.");
  });

  // Get the service from an injector!
  // 3 Ways to do it:

  // 1- from the Component's Injector
  // The way that will always work (Angular has a hierarchy of injectors) is to ask the component's injector
  // (we can access it through the fixture).
  it("should access the injected service from the Component's Injector", () => {
    const auth = fixture.debugElement.injector.get(AuthService);
    expect(auth).not.toBeNull();
  });

  // 2- from TestBed.get() if the service is registered with the module
  it("should access the injected service from the TestBed.get()", () => {
    const auth = TestBed.get(AuthService);
    expect(auth).not.toBeNull();
  });

  // 3- using the inject() utility function if the service is registered with the module
  it("should access the injected service from the TestBed.get()", inject([AuthService], (auth) => {
    expect(auth).not.toBeNull();
  }));

  // Do not use the Service Stub definition object in a Test, it's different than the object
  // being injected!
  it('the orignal stub definition object and the injected UserService should not be the same', () => {
    // this test verifies that the instance of the object you registered
    // is not the same that will be served to the component
    const auth = fixture.debugElement.injector.get(AuthService);
    expect(authServiceStub === auth).toBe(false);

    // Changing the stub object has no effect on the injected service
    (<any>authServiceStub).isLoggedIn = true;
    expect(auth.isLoggedIn).toBe(false);

    // restore the original behavior so other tests are not impacted
    (<any>authServiceStub).isLoggedIn = false;
  });

  // shows the component is poorly written (binding are evaluated only in the onInit())
  it("if we authenticate a user (later on) should display 'please log in'", () => {
    // force the usual Angular behavior (evaluate bindings right after component creation)
    fixture.detectChanges();

    const auth = fixture.debugElement.injector.get(AuthService);

    (<any>auth).isLoggedIn = true;
    (<any>auth).username = "Alessandro";

    // even with this approach it will never update the message, it's set in the OnInit
    // (detectChanges is called in the beforeEach)
    // and when the component was created the user was not authenticated.
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css("h3")).nativeElement;
    expect(el.textContent).toBe("please log in.");
    // so the component is not really well made.
  });

  it("should display greetings message when the user is authenticated", () => {
    const auth = fixture.debugElement.injector.get(AuthService);

    // however is we change the values before the OnInit(), it will work!
    (<any>auth).isLoggedIn = true;
    (<any>auth).username = "Alessandro";

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css("h3")).nativeElement;
    expect(el.textContent).toBe("Welcome, Alessandro");
  });

});

// SPY ON / STUB the real implementation (change methods behavior)

// Provide a Test Double for the injected service, 2 approaches:
// - Stub: provide a stub object.
// - Spy the real service: provide the real implementation of the service and stub its behavior with 'spyOn'.
//
// However always get the service from an Injector
// do not reference this instance insice tests anymore, the instance that will be injected in the
// component is a clone - something different - of this object!
// - This object can be used to configure the service until it's injected in the SUT.
// - If you want to change properties of the injected object, you'll need to get
//   a reference to the injected service using an injector!
describe('02 - Angular Tests - with dep. - GreetingsComponent - Stub/SpyOn Injected Service', () => {
  let component: GreetingsComponent;
  let fixture: ComponentFixture<GreetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingsComponent],
      providers: [AuthApiService, AuthService]
    }).compileComponents();
  }));

  /* You can change the stub properties and values until the first instance of that
     object is provided to someone.

  beforeEach(() => {
    authServiceStub.isLoggedIn = true;
    authServiceStub.username = "Giorgetti";
  })
  */

  // creates an instance of the component for each test, right after the initialization
  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingsComponent);
    component = fixture.componentInstance;

    // spyOn()
    // change the service behavior before the first detectChanges() call!
    // authenticate a user.
    const auth = fixture.debugElement.injector.get(AuthService);

    spyOnProperty(auth, "isLoggedIn", "get").and.returnValue(true);
    spyOnProperty(auth, "username", "get").and.returnValue("Alessandro");

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // Get the service from an injector!
  // 3 Ways to do it:

  // 1- from the Component's Injector
  // The way that will always work (angular has a ierarchy of injectors) is to ask the component's injector
  // (we can access it through the fixture).
  it("should access the injected service from the Component's Injector", () => {
    const auth = fixture.debugElement.injector.get(AuthService);
    expect(auth).not.toBeNull();
    // verify the spy worked!
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.username).toBe("Alessandro");
  });

  // 2- from TestBed.get() if the service is registered with the module
  it("should access the injected service from the TestBed.get()", () => {
    const auth = TestBed.get(AuthService);
    expect(auth).not.toBeNull();
    // verify the spy worked!
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.username).toBe("Alessandro");
  });

  // 3- using the inject() utility function if the service is registered with the module
  it("should access the injected service from the TestBed.get()", inject([AuthService], (auth) => {
    expect(auth).not.toBeNull();
    // verify the spy worked!
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.username).toBe("Alessandro");
  }));

  it("should display greetings message when the user is authenticated", () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css("h3")).nativeElement;
    expect(el.textContent).toBe("Welcome, Alessandro");
  });

});

/**
 * Test Services and Components with Angular Testing Utilities
 */

import { async } from "@angular/core/testing";
import { TestBed } from "@angular/core/testing";
import { inject } from "@angular/core/testing";
import { AuthApiService } from "../../services/auth-api.service";
import { AuthService } from "../../services/auth.service";
import { AppComponent } from "../../app.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

// -------------------------------------------------------------
// Test Services
// -------------------------------------------------------------

// Jasmine uses describe() to setup a test suite
describe('00 - Angular Tests - initialization - AuthService', () => {
  // Jarmine runs the beforEach() function before each test to
  // reset the configuration of the testing TestBed NgModule;
  // this way it will provide us with a clean environment every time.
  // You can have more than one beforeEach() in a test suite, they will be executed in the correct order.
  beforeEach(async(() => {
    // the component might have external resources, and we need to give the compiler time to read them
    // the async() Angular test function will arrange the things so that the code runs in a special async test zone.
    // All the tests will be executed after any async operation started in the beforEach has been completed.

    // TestBed is used to define a dynamically generated NgModule.
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        AuthService
      ]
    }).compileComponents();
    // calling 'compileComponents()' locks down the testing module. No more configuration
    // or override methods calls are allowed after this call.
    // if you don't call .compileComponents(), the first call to .createComponent() will
    // lock down the TestBed module too.
    // WebPack users do not need to call .compileComponents(), everything is inlined during the build phase.
  }));

  // Get the service from an injector!
  // 2 ways to do it:

  // 1- using TestBed.get() if the service is registered with the module
  it("should access the injected service from the TestBed.get()", () => {
    const auth = TestBed.get(AuthService) as AuthService;
    // expect() is used to verify expectations.
    expect(auth).not.toBeNull();
  });

  // 2- using the inject() utility function if the service is registered with the module
  it("should access the injected service from the TestBed.get()", inject([AuthService], (auth: AuthService) => {
    expect(auth).not.toBeNull();
  }));

  it('should be created', () => {
    const auth = TestBed.get(AuthService) as AuthService;
    // expect() is used to verify expectations.
    expect(auth).toBeTruthy();
  });

  // let's see some synchronous testing (no remote service involved)

  it('should have noone logged in', () => {
    const auth = TestBed.get(AuthService) as AuthService;

    expect(auth.isLoggedIn).toBeFalsy();
  });

  it("should login a user", () => {
    const auth = TestBed.get(AuthService) as AuthService;

    auth.login("Alessandro", "12345");
    expect(auth.isLoggedIn).toBeTruthy();
    expect(auth.username).toBe("Alessandro");
  });
});

// -------------------------------------------------------------
// Test Components as services
// -------------------------------------------------------------

// To test the Component Class only, without the bindings and template,
// register the component in the providers list and test it as a service

// Jasmine uses describe() to setup a test suite
describe('00 - Angular Tests - initialization - AppComponent as a Service', () => {
  // Jarmine runs the beforEach() function before each test to
  // reset the configuration of the testing TestBed NgModule;
  // this way it will provide us with a clean environment every time.
  // You can have more than one beforeEach() in a test suite, they will be executed in the correct order.
  beforeEach(async(() => {
    // the component has external resources, and we need to give the compiler time to read them
    // the async() Angular test function will arrange the things so that the code runs in a special async test zone.
    // All the tests will be executed after any async operation started in the beforEach has been completed.

    // TestBed is used to define a dynamically generated NgModule.
    TestBed.configureTestingModule({
      providers: [
        AppComponent
      ],
    }).compileComponents();
    // calling 'compileComponents()' locks down the testing module. No more configuration
    // or override methods calls are allowed after this call.
    // if you don't call .compileComponents(), the first call to .createComponent() will
    // lock down the TestBed module too.
    // WebPack users do not need to call .compileComponents(), everything is inlined during the build phase.
  }));

  it('should create the app', () => {
    // use .get() to get an instance of the Component class.
    // A ComponentFixture is what you use to gain access to the component controller instance (componentInstance)
    const app = TestBed.get(AppComponent) as AppComponent;
    expect(app).toBeTruthy();
    expect(app.title).toBe("Unit Testing an Angular App!");
  });

  it('should do Something', () => {
    // use .get() to get an instance of the Component class.
    // A ComponentFixture is what you use to gain access to the component controller instance (componentInstance)
    const app = TestBed.get(AppComponent) as AppComponent;
    expect(app.doSomething()).toBe("done");
  });
});

// -------------------------------------------------------------
// Test Components
// -------------------------------------------------------------

// Jasmine uses describe() to setup a test suite
describe('00 - Angular Tests - initialization - AppComponent', () => {
  // Jarmine runs the beforEach() function before each test to
  // reset the configuration of the testing TestBed NgModule;
  // this way it will provide us with a clean environment every time.
  // You can have more than one beforeEach() in a test suite, they will be executed in the correct order.
  beforeEach(async(() => {
    // the component has external resources, and we need to give the compiler time to read them
    // the async() Angular test function will arrange the things so that the code runs in a special async test zone.
    // All the tests will be executed after any async operation started in the beforEach has been completed.

    // TestBed is used to define a dynamically generated NgModule.
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    // calling 'compileComponents()' locks down the testing module. No more configuration
    // or override methods calls are allowed after this call.
    // if you don't call .compileComponents(), the first call to .createComponent() will
    // lock down the TestBed module too.
    // WebPack users do not need to call .compileComponents(), everything is inlined during the build phase.
  }));

  it('should create the app', () => {
    // use .createComponent() to get a ComponentFixture object.
    // A ComponentFixture is what you use to gain access to the component controller instance (componentInstance)
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toBe("Unit Testing an Angular App!");
  });

  it(`should have as title 'Unit Testing an Angular App!'`, () => {
    // use .createComponent() to get a ComponentFixture object.
    // A ComponentFixture is what you use to gain access to the component DOM nodes (debugElement)
    const fixture = TestBed.createComponent(AppComponent);
    // you can also access the .componentInstance from the .debugElement
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Unit Testing an Angular App!');
  });

  it("should not have any title in the DOM until Angular calls for change detection.", () => {
    // use .createComponent() to get a ComponentFixture object.
    // A ComponentFixture is what you use to gain access to the component DOM nodes (debugElement)
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent.trim()).toEqual("Welcome to");
  });
});

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
// this is an Angular testing utility that can be used to produce predicates used by the DebugElement.query() method
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Jasmine uses describe() to setup a test suite
describe('AppComponent', () => {
  // Jarmine runs the beforEach() function before each test to
  // reset the configuration of the testing TestBed NgModule before each test, it will provide you
  // with a clean environment every time.
  // You can have more than one beforeEach() in a test suite, they will be executed in the correct order.
  beforeEach(async(() => {
    // the component has external resources, and we need to give the compiler time to read them
    // the async() Angular test function will arrange the things so that the code is run in a special async test zone.
    // All the tests will be executed after any async operation started in the beforEach has been completed.

    // TestBed is used to define a dynamically generated NgModule.
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    // calling '.compileComponents()' locks down the testing module. No more configuration
    // or override methods calls are allowed after this call.
    // If you don't call .compileComponents(), the first call to .createComponent() will
    // lock down the TestBed module too.
    // WebPack users do not need to call .compileComponents(), everything is inlined during the build phase.
  }));

  it('should create the app', () => {
    // A ComponentFixture is what you use to gain access to the component controller instance (componentInstance)
    // and to the component DOM nodes (debugElement)
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Unit Testing an Angular App!'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Unit Testing an Angular App!');
  });

  // changeDetection() is not automatic, this is intentional, so the user
  // has a chance to inspect the component before Angular does its magic.
  // You can change this behavior configuring ComponentFixtureAutoDetect, like this:
  // { provide: ComponentFixtureAutoDetect, useValue: true }
  it("should not have any title in the DOM until manually call 'detectChanged'", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent.trim()).toEqual("Welcome to");
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    // ask Angular to apply its change detection cycle (all the bindings will be evaluated).
    // Angular responds to asynchronous activities such as promise resolution, timers, and DOM events.
    // WARNING!!! A direct, synchronous update of the component property is invisible.
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Unit Testing an Angular App!');
  });

  it('should render title in a h1 tag (using .query(By))', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // use .query(By.css) to retrieve the first element that matches the css selector
    const compiled = fixture.debugElement.query(By.css("h1")).nativeElement;
    expect(compiled.textContent).toContain('Welcome to Unit Testing an Angular App!');
  });

  // WARNING!!! A direct, synchronous update (without a change detection) of the component property is invisible.
  it('a synchronous update of a property is invisible', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // it now reads 'Welcome to app!'
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Unit Testing an Angular App!');

    // update the title
    fixture.componentInstance.title = "app v2";
    // it still reads 'Welcome to app!'
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Unit Testing an Angular App!');
  });

  it("should display a different title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    // access and interact with the componentInstance
    fixture.componentInstance.title = "New Title";
    // ask Angular to apply its change detection cycle (bindings will be evaluated)
    fixture.detectChanges();

    const compiled = fixture.debugElement.query(By.css("h1")).nativeElement;
    expect(compiled.textContent).toContain('New Title');
  });
});

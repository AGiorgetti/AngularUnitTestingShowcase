/**
 * Shows how to test a Component with a Dependency (a Service that exposes Observables)
 * using rxjs/testing and jasmine-marbles.
 *
 * Angular testing Utilities (async, fakeAsync) can be used in combination with the TestScheduler
 * to simulate the passage of time for the Angular component.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthObservableApiService } from '../../services/observables/auth-observable-api.service';
import { AuthObservableService } from '../../services/observables/auth-observable.service';
import { By } from '@angular/platform-browser';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { GreetingsObservableComponent } from '../../components/greetings-observable/greetings-observable.component';


describe('04 - Angular Tests - rxjs marble testing - GreetingsObservableComponent', () => {
  let component: GreetingsObservableComponent;
  let fixture: ComponentFixture<GreetingsObservableComponent>;

  let authService: AuthObservableService;
  let loggedUser$: jasmine.Spy;
  let el: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingsObservableComponent],
      providers: [AuthObservableApiService, AuthObservableService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingsObservableComponent);
    component = fixture.componentInstance;

    authService = fixture.debugElement.injector.get(AuthObservableService);

    // add a spy that provides the test with the proper data: this should be an Observable
    loggedUser$ = spyOnProperty(authService, "loggedUser$", "get");

    el = fixture.debugElement.query(By.css("h3")).nativeElement;

    // will call this in the actual tests, to check for initialized state
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not anything before OnInit', () => {
    // no change detection
    expect(el.textContent).toBe('', 'nothing should be displayed');
    expect(loggedUser$.calls.any()).toBe(false, 'loggedUser$ not yet called');
  });

  it('should still not showing greetings after component initialize', () => {
    loggedUser$.and.callThrough(); // the BehaviorSubject will return "null"

    // force change detecion, calls ngOnInit
    fixture.detectChanges();

    // loggedUser$ is an observable => it will be initialized, null will be emitted by
    // the BehaviorSubject
    expect(el.textContent).toBe('please log in.', 'should have been: please log in.');
    expect(loggedUser$.calls.any()).toBe(true, 'loggedUser$ called');
  });

  it('should display a Welcome message when the user log in', () => {
    const o$ = cold('--a', { a: 'Alessandro' });
    loggedUser$.and.returnValue(o$);

    // force change detecion, calls ngOnInit
    fixture.detectChanges();

    // nothing has been emitted, the test observable was not activated
    expect(el.textContent).toBe('', 'nothing should be displayed');

    // activate the observable, let the time move on
    getTestScheduler().flush();

    // fupdate the view
    fixture.detectChanges();

    expect(loggedUser$.calls.any()).toBe(true, 'loggedUser$ called');
    expect(el.textContent).toBe('Welcome, Alessandro', 'should have been: Welcome, Alessandro.');
  });
});

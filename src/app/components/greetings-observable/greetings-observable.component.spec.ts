import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GreetingsObservableComponent } from './greetings-observable.component';
import { AuthObservableApiService } from '../../services/observables/auth-observable-api.service';
import { AuthObservableService } from '../../services/observables/auth-observable.service';
import { By } from '@angular/platform-browser';
import { cold, getTestScheduler } from 'jasmine-marbles';


describe('GreetingsObservableComponent', () => {
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

    // add a spy that provides the test with the proper initialization
    // we simulate having a user already authenticated, the server have to provide the
    // data.
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

  it('should still not showing greetings after component initialized', () => {
    loggedUser$.and.callThrough(); // the BehaviorSubject will return "null"

    // force change detecion, calls ngOnInit
    fixture.detectChanges();

    // loggedUser$ is on observable => it will be initialized, but no value has been emitted
    expect(el.textContent).toBe('please log in.', 'should have been: please log in.');
    expect(loggedUser$.calls.any()).toBe(true, 'loggedUser$ called');
  });

  it('should display a Welcome message when the user log in', () => {
    const o$ = cold('--a', { a: 'Alessandro' });
    loggedUser$.and.returnValue(o$);

    // force change detecion, calls ngOnInit
    fixture.detectChanges();

    // nothing has been emitted, test observables were not activated
    expect(el.textContent).toBe('', 'nothing should be displayed');

    // activate the observable, let the time move on
    getTestScheduler().flush();

    // fupdate the view
    fixture.detectChanges();

    expect(loggedUser$.calls.any()).toBe(true, 'loggedUser$ called');
    expect(el.textContent).toBe('Welcome, Alessandro', 'should have been: Welcome, Alessandro.');
  });
});

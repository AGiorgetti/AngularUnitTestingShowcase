import { cold, getTestScheduler } from "jasmine-marbles";
import { of } from "rxjs";
import { AuthObservableApiService } from "../../services/observables/auth-observable-api.service";
import { AuthObservableService } from "../../services/observables/auth-observable.service";

/**
 * "Marble Testing" is useful to test rxjs Observale scenarios
 *
 * npm install jasmine-marbles
 *
 * we'll use jasmine's Spy and Marble Testing utilities to simulate the service behavior.
 *
 * SYNCHRONOUS: marble tests are all synchronous: they use a TestScheduler to simulate the passage of time
 */

describe('06 - Marble Tests', () => {

  let authApiServiceStub: AuthObservableApiService;
  let sut: AuthObservableService;

  beforeEach(() => {
    // create a stub object and use jasmine to provide predefined return values to funcitons
    authApiServiceStub = <AuthObservableApiService>{};
    authApiServiceStub.login = () => null;
    sut = new AuthObservableService(authApiServiceStub);
  });

  // first attempts: use a "Tape recorder" to buildup a marble representation of the output

  it('should login a user', () => {
    // mock the login behavior
    spyOn(authApiServiceStub, 'login').and.callFake(function () { return of(arguments[0]); });

    let marble = '';
    const values = {};
    let idx = 0;

    // be careful! it work only for the first 10 symbols [0-9]
    sut.loggedUser$.subscribe(
      data => {
        idx++;
        if (data != null) {
          marble = marble + idx;
          values['' + idx] = data;
        } else {
          marble = marble + '-';
        }
      }
    );

    sut.login('Alessandro', '12345');

    getTestScheduler().flush();

    const taped = cold(marble, values);

    // use rxjs/testing and jasmine-marbles to verify the expectation based on observables
    const expected = cold('-x', { x: 'Alessandro' });
    expect(taped).toBeObservable(expected);
  });

  it('should notify users changes as multiple users login', () => {
    // mock the login behavior
    const scheduler = getTestScheduler();
    spyOn(authApiServiceStub, 'login').and
      .callFake(function () { return of(arguments[0], scheduler); });

    let marble = '';
    const values = {};
    let idx = 0;

    // be careful! it work only for the first 10 symbols [0-9]
    sut.loggedUser$.subscribe(
      data => {
        idx++;
        if (data != null) {
          marble = marble + idx;
          values['' + idx] = data;
        } else {
          marble = marble + '-';
        }
      }
    );

    /*
    using a subscription causes more 'delay' slot ['--']
    to be emitted, there are more async operations involved

    const actions = cold("123", { '1': 'Alessandro', '2': 'Marco', '3': 'Michela' });

    actions.subscribe(username => {
      sut.login(username, '12345');
    });
    */

    sut.login('Alessandro', '12345');
    sut.login('Marco', '12345');
    sut.login('Michela', '12345');

    scheduler.flush();

    const taped = cold(marble, values);
    // use rxjs/testing and jasmine-marbles to verify the expectation based on observables
    const expected = cold('-abc', { a: 'Alessandro', b: 'Marco', c: 'Michela' });
    expect(taped).toBeObservable(expected);
  });

  // rewrite the tests using a TestScheduler

  it('[TestScheduler] should login a user', () => {
    const scheduler = getTestScheduler();

    // mock the login behavior
    // WARNING: it is important to pass the test scheduler along all the observable chain!
    spyOn(authApiServiceStub, 'login').and
      .callFake(function () { return of(arguments[0], scheduler); });

    // use the scheduler to execute operations at give time frames
    // the SUT internally uses a behavior subject with emit a 'null'
    // value when initialized, thus using the first time slot
    // so we specify 10, this way we emit on the second timeslot
    scheduler.schedule(() => sut.login('Alessandro', '12345'), 10);

    // use rxjs/testing and jasmine-marbles to verify the expectation based on observables
    const expected = cold('ab', { a: null, b: 'Alessandro' });

    expect(sut.loggedUser$).toBeObservable(expected);

    // activate the scheduler so the test can properly run!
    scheduler.flush();
  });

  it('[TestScheduler] should notify users changes as multiple users login', () => {
    const scheduler = getTestScheduler();

    // mock the login behavior
    // WARNING: it is important to pass the test scheduler along all the observable chain!
    spyOn(authApiServiceStub, 'login').and.callFake(function () { return of(arguments[0], scheduler); });

    // use the scheduler to execute operations at give time frames
    // the SUT internally uses a behavior subject with emit a 'null'
    // value when initialized, thus using the first time slot
    // so we specify 10, this way we emit on the second timeslot
    scheduler.schedule(() => sut.login('Alessandro', '12345'), 10);
    scheduler.schedule(() => sut.login('Marco', '12345'), 20);
    scheduler.schedule(() => sut.login('Michela', '12345'), 30);

    // use rxjs/testing and jasmine-marbles to verify the expectation based on observables
    const expected = cold('0abc', { '0': null, a: 'Alessandro', b: 'Marco', c: 'Michela' });

    expect(sut.loggedUser$).toBeObservable(expected);

    // activate the scheduler so the test can properly run!
    scheduler.flush();
  });

});

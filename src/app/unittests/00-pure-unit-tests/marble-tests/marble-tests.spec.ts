import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { of, throwError, Subject, from } from 'rxjs';
import { throttle } from 'rxjs/operators';
import { delay } from 'q';

/**
 * "Marble Testing" is useful to test rxjs Observale scenarios
 *
 * npm install jasmine-marbles
 *
 * "jasmine-marbles" is a wrapper around rxjs/testing with some jasmine extensions to tests conditions on observables.
 *
 * RxJS Marble Testing
 *
 * We can test our asynchronous RxJS code synchronously and deterministically by virtualizing time using the TestScheduler.
 *
 * ASCII marble diagrams provide a visual way for us to represent the behavior of an Observable.
 */

/**
 * the following tests come from: "https://stackblitz.com/edit/jasmine-marbles-testing" and shows the basics of rxjs marble testing
 *
 * RxJS marble testing allows for a more natural style of testing observables.
 *
 * Marble diagrams syntax:
 * - `-` (dash): indicates a passing of time, you can thing of each dash as 10ms when it comes to your tests;
 * - `a`, `b`, `c`... (characters): each character insde the dash indicates an emission;
 * - `|` (pipes): indicate the completion point of an observable;
 * - `()` (parenthesis): indicate the multiple emission in the same time frame;
 * - `^` (caret): indicates the starting point of a subscription;
 * - `!` (exclamation point): indicates the end point of a subscription;
 * - `#` (pound sign): indicates error;
 */

describe('Marble testing basics', () => {
  it('should understand marble diagram', () => {
    const source = cold('--');
    const expected = cold('--');

    expect(source).toBeObservable(expected);
  });

  describe('cold observable', () => {
    it('should support basic string values', () => {
      const source = cold('-a-|');
      const expected = cold('-a-|');

      expect(source).toBeObservable(expected);
    });

    it('should support basic values provided as params (number)', () => {
      const source = cold('-a-|', { a: 1 });
      const expected = cold('-a-|', { a: 1 });

      expect(source).toBeObservable(expected);
    });

    it('should support basic values provided as params (object)', () => {
      const source = cold('-a-|', { a: { key: 'value' } });
      const expected = cold('-a-|', { a: { key: 'value' } });

      expect(source).toBeObservable(expected);
    });

    it("should support basic errors", () => {
      const source = cold('--#');
      const expected = cold('--#');

      expect(source).toBeObservable(expected);
    });

    it("should support custom errors", () => {
      const source = cold('--#', null, new Error('Oops!'));
      const expected = cold('--#', null, new Error('Oops!'));

      expect(source).toBeObservable(expected);
    });

    it("should support custom Observable error", () => {
      const source = throwError(new Error('Oops!'));
      const expected = cold('#', null, new Error('Oops!'));

      expect(source).toBeObservable(expected);
    });

    it("should support multiple emission in the same time frame", () => {
      const source = of(1, 2, 3);
      const expected = cold('(abc|)', { a: 1, b: 2, c: 3 });

      expect(source).toBeObservable(expected);
    });

    it("should support TestScheduler to simulate passage of time", () => {
      const scheduler = getTestScheduler();
      const source = new Subject<number>();
      // there's a problem with a Subject and the frame 0, so let's skip it
      scheduler.schedule(() => source.next(1), 10);
      scheduler.schedule(() => source.next(2), 20);
      scheduler.schedule(() => source.next(3), 30);
      scheduler.schedule(() => source.complete(), 40);

      // there's a problem with a Subject and the frame 0, so let's skip it
      const expected = cold('-abc|', { a: 1, b: 2, c: 3 });
      expect(source).toBeObservable(expected);

      // start the observables
      scheduler.flush();
    });
  });

  describe('hot observable', () => {
    it('should support basic hot observable', () => {
      const source = hot('-^a-|', { a: 5 });
      const expected = cold('-a-|', { a: 5 });

      expect(source).toBeObservable(expected);
    });

    it('should support testing subscriptions', () => {
      const source = hot('-a-^b---c-|');
      const subscription = '^------!';
      const expected = cold('-b---c-|');

      expect(source).toBeObservable(expected);
      expect(source).toHaveSubscriptions(subscription);
    });
  });
});

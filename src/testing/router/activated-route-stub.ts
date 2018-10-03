import { convertToParamMap, ParamMap, Params, Data } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subjectParamMap = new ReplaySubject<ParamMap>();
  private subjectParams = new ReplaySubject<Params>();
  private snapshotParams: Params;
  private subjectData = new ReplaySubject<Data>();
  private snapshotData: Data;

  constructor(initialParams?: Params, initialData?: Data) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  public readonly paramMap = this.subjectParamMap.asObservable();
  public readonly params = this.subjectParams.asObservable();
  public readonly data = this.subjectData.asObservable();

  /** Set the paramMap observables's next value */
  public setParamMap(params?: Params) {
    this.snapshotParams = params;
    this.subjectParamMap.next(convertToParamMap(params));
    this.subjectParams.next(params);
  }

  public setData(data?: Data) {
    this.snapshotData = data;
    this.subjectData.next(data);
  }

  // ActivatedRoute.snapshot
  get snapshot() {
    return {
      params: this.snapshotParams,
      data: this.snapshotData
    };
  }
}

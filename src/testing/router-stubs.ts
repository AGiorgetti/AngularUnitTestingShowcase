 // export for convenience.
export { ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';

import { Component, Directive, Injectable, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';

@Directive({
  selector: '[routerLink]',
  host: {
    '(click)': 'onClick()'
  }
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Component({selector: 'router-outlet', template: ''})
export class RouterOutletStubComponent { }

@Injectable()
export class RouterStub {
  navigate(commands: any[], extras?: NavigationExtras) { }
}


// Only implements params and part of snapshot.params
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subjectParams = new BehaviorSubject(this.testParams);
  params = this.subjectParams.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subjectParams.next(params);
  }

  // ActivatedRoute.data is Observable
  private subjectData = new BehaviorSubject(this.testData);
  data = this.subjectData.asObservable();

  private _testData: {};
  get testData() { return this._testData; }
  set testData(data: {}) {
    this._testData = data;
    this.subjectData.next(data);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return {
      params: this.testParams,
      data: this.testData
    };
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

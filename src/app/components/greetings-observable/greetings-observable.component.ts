import { Component, OnInit } from '@angular/core';
import { AuthObservableService } from '../../services/observables/auth-observable.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-greetings-observable',
  templateUrl: './greetings-observable.component.html',
  styleUrls: ['./greetings-observable.component.css']
})
export class GreetingsObservableComponent implements OnInit {

  public greetings$: Observable<string>;

  constructor(
    private _authService: AuthObservableService
  ) {
    /*
     * Should not initialize the field in the constructor, the spies in tests can be installed
     * only after the component and it's dependencies have been created.
     * If we keep the initialization in the constructor the "get" property will be called befor a
     * jasmine spy can be installed.

    this.greetings$ = _authService.loggedUser$.pipe(
      map(loggedUser => loggedUser != null && loggedUser !== "" ? "Welcome, " + loggedUser : "please log in.")
    );
    */
  }

  ngOnInit() {
    this.greetings$ = this._authService.loggedUser$.pipe(
      map(loggedUser => loggedUser != null && loggedUser !== "" ? "Welcome, " + loggedUser : "please log in.")
    );
  }

}

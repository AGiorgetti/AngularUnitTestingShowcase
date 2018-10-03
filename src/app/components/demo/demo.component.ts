import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthObservableService } from '../../services/observables/auth-observable.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private authObservableService: AuthObservableService
  ) {
    this.authService.login("Alessandro", "12345");
    this.authService.loginAsync("Alessandro", "12345");
    this.authObservableService.login("Alessandro", "12345");
  }

  ngOnInit() {
  }

}

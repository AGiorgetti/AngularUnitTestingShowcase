import { Component, OnInit } from '@angular/core';
import { AuthService } from "app/services/auth.service";

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.css']
})
export class GreetingsComponent implements OnInit {

  public greetings = "...";

  constructor(
    private _authService: AuthService
  ) { }

  // This component is poorly implemented: once initialized there's no way yo changed the status of the user
  ngOnInit() {
    this.greetings = this._authService.isLoggedIn ? "Welcome, " + this._authService.username : "please log in.";
  }

}

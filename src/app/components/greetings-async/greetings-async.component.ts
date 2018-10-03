import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-greetings-async',
  templateUrl: './greetings-async.component.html',
  styleUrls: ['./greetings-async.component.css']
})
export class GreetingsAsyncComponent implements OnInit {

  public greetings = "...";

  constructor(
    private _authService: AuthService
  ) { }

  // This component is poorly implemented: once initialized there's no way yo changed the status of the user
  async ngOnInit() {
    const loggedUser = await this._authService.getLoggedUserAsync();

    this.greetings = loggedUser != null && loggedUser !== "" ? "Welcome, " + loggedUser : "please log in.";
  }

}

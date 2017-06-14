import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GreetingsComponent } from './components/greetings/greetings.component';
import { AuthService } from "app/services/auth.service";
import { AuthApiService } from "app/services/auth-api.service";
import { GreetingsAsyncComponent } from './components/greetings-async/greetings-async.component';

@NgModule({
  declarations: [
    AppComponent,
    GreetingsComponent,
    GreetingsAsyncComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

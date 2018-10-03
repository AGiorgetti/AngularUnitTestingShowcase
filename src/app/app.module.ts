import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GreetingsComponent } from './components/greetings/greetings.component';
import { GreetingsAsyncComponent } from './components/greetings-async/greetings-async.component';

import { AuthService } from './services/auth.service';
import { AuthApiService } from './services/auth-api.service';
import { GreetingsObservableComponent } from './components/greetings-observable/greetings-observable.component';
import { DemoComponent } from './components/demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    GreetingsComponent,
    GreetingsAsyncComponent,
    GreetingsObservableComponent,
    DemoComponent
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

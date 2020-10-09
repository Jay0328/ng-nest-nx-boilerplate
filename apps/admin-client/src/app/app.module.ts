import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UiModule } from '@nnb/ui';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { AppRoutingModule } from './app-routing.module';
import { NoAuthModule } from './no-auth/no-auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, GraphQLModule, UiModule, NoAuthModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

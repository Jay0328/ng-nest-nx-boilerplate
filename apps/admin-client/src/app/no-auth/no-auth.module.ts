import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAuthRoutingModule } from './no-auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, NoAuthRoutingModule],
  declarations: [LoginComponent]
})
export class NoAuthModule {}

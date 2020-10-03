import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button/button.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonDirective],
  exports: [ButtonDirective]
})
export class UiModule {}

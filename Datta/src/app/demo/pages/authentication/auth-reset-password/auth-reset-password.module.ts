import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthResetPasswordRoutingModule } from "./auth-reset-password-routing.module";
import { AuthResetPasswordComponent } from "./auth-reset-password.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, AuthResetPasswordRoutingModule],
  declarations: [AuthResetPasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthResetPasswordModule {}

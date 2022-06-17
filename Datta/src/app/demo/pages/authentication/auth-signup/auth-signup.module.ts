import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthSignupRoutingModule } from "./auth-signup-routing.module";
import { AuthSignupComponent } from "./auth-signup.component";

@NgModule({
  imports: [CommonModule, AuthSignupRoutingModule],
  declarations: [AuthSignupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthSignupModule {}

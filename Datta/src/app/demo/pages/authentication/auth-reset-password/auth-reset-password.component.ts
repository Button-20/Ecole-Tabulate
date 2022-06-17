import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/features/user.service";

@Component({
  selector: "app-auth-reset-password",
  templateUrl: "./auth-reset-password.component.html",
  styleUrls: ["./auth-reset-password.component.scss"],
})
export class AuthResetPasswordComponent implements OnInit {
  resetForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  serverErrorMessages = "";

  constructor(public userService: UserService, public toastr: ToastrService) {}

  ngOnInit() {}

  async resetFormSubmit() {
    const resp: any = await this.userService.resetPassword(
      this.resetForm.value.email
    );
    this.resetForm.reset();
    await this.toastr.success(resp.message, "Email Sent");
  }
}

import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/features/user.service";
import { MustMatch } from "./MustMatch";

@Component({
  selector: "app-auth-confirm-password",
  templateUrl: "./auth-confirm-password.component.html",
  styleUrls: ["./auth-confirm-password.component.scss"],
})
export class AuthConfirmPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  serverErrorMessages = "";

  constructor(
    public userService: UserService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
        ]),
        confirmpassword: new FormControl("", [Validators.required]),
      },
      { validators: MustMatch("password", "confirmpassword") }
    );
  }

  ngOnInit() {}

  async passwordFormSubmit() {
    if (this.passwordForm.valid) {
      let token = this.activatedRoute.snapshot.params.token;
      const resp: any = await this.userService.confirmNewPassword(
        token,
        this.passwordForm.value
      );
      console.log(resp);
      this.passwordForm.reset();
      this.toastr.success(resp.message, "Password Reset!!");
      this.router.navigate(["auth/signin"]);
    } else return null;
  }
}

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/features/user.service";

@Component({
  selector: "app-auth-signin",
  templateUrl: "./auth-signin.component.html",
  styleUrls: ["./auth-signin.component.scss"],
})
export class AuthSigninComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
  });
  serverErrorMessages = "";
  // permission: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.userService.isLoggedIn())
      this.router.navigate(["dashboard/default"]);
  }

  async loginUser() {
    const resp: any = await this.userService.login(this.loginForm.value);
    this.userService.setToken(resp["token"]);
    this.toastr.success("Logged In Successfully", "Login Success");
    this.router.navigate(["dashboard/default"]);
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }
}

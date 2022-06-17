import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { UserService } from "src/app/services/features/user.service";

@Injectable({
  providedIn: "root",
})
export class RestrictGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    var payload = await this.userService.getUserPayload();
    if (payload && payload.role !== "admin") {
      alert("You are not allow to access this route.");
      this.router.navigate(["/auth/signin"]);
      return false;
    }

    return true;
  }
}

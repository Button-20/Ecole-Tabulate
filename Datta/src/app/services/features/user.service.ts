import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { StorageServices } from "../core/storage-services.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public isOnline: boolean = false;

  users: any[];
  selectedUser: any;
  serverErrorMessages = "";

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: "True" }) };

  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storage: StorageServices
  ) {}

  // Actions that can be done to user
  async login(authCredentials) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.post(
          environment.apiBaseUrl + "/authenticate",
          authCredentials,
          this.noAuthHeader
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Login Failed"
              );
              reject({ error: ex.error || ex || "Login Failed" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "Login Failed" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async resetPassword(email) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + `/reset-password/${email}`,
          this.noAuthHeader
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Reset Password Failed"
              );
              reject({ error: ex.error || ex || "Reset Password Failed" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "Reset Password Failed" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async confirmNewPassword(token: string, passwordForm) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.post(
          environment.apiBaseUrl + `/password-reset/confirm/${token}`,
          passwordForm,
          this.noAuthHeader
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Confirm Password Failed"
              );
              reject({ error: ex.error || ex || "Confirm Password Failed" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "Confirm Password Failed" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async postUser(user: any) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.post(
          environment.apiBaseUrl + "/register",
          user
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "User Post Failed"
              );
              reject({ error: ex.error || ex || "User Post Failed" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "User Post Failed" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getUserList() {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/users"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Users Fetch Failed!"
              );
              reject({ error: ex.error || ex || "Users Fetch Failed!" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "Users Fetch Failed!" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getUserByID(_id: string) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + `/users/${_id}`
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "User Fetch Failed!"
              );
              reject({ error: ex.error || ex || "User Fetch Failed!" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "User Fetch Failed!" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async putUser(user: any) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.put(
          environment.apiBaseUrl + `/users/${user._id}`,
          user
        );
        resp.subscribe(async (ex) => {
          if (ex.status === 422) {
            this.toastr.warning(
              (this.serverErrorMessages = await ex.error.message),
              "User Update Failed!"
            );
            reject({ error: ex.error || ex || "User Update Failed!" });
          } else {
            this.toastr.error(
              (this.serverErrorMessages =
                "Something went wrong. Please contact admin."),
              "Error 422"
            );
            reject({ error: ex.error || ex || "User Update Failed!" });
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteUser(_id: string) {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.delete(
          environment.apiBaseUrl + `/users/${_id}`
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "User Delete Failed!"
              );
              reject({ error: ex.error || ex || "User Delete Failed!" });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "User Delete Failed!" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllUsersCount() {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/allusers/users"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Users Count Error!"
              );
              reject({
                error: ex.message || ex || "Users Count Error!",
              });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Users Count Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllAdminsCount() {
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/allusers/admin"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Female Count Error!"
              );
              reject({
                error: ex.message || ex || "Female Count Error!",
              });
            } else {
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Female Count Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  // End of Actions

  getToken() {
    return this.storage.getItem("token");
  }

  setToken(token: string) {
    this.storage.saveItem("token", token);
  }

  deleteToken() {
    this.storage.clear();
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split(".")[1]);
      return JSON.parse(userPayload);
    } else return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload) return userPayload.exp > Date.now() / 1000;
    else return false;
  }
}

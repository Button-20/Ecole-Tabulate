import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { RequestService } from "src/app/services/core/request-services.service";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  count: any;
  present = 0;
  absent = 0;
  serverErrorMessages = "";

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: "True" }) };
  //
  constructor(
    private api: RequestService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {}

  async postStudent(student: any) {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.post(
          environment.apiBaseUrl + "/student/register",
          student
        );
        await resp.subscribe(
          async (res: any) => {
            this.spinner.hide();
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 422) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Student Post Failed"
              );
              reject({ error: ex.error || ex || "Student Post Failed" });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.error || ex || "Student Post Failed" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async postStudentExcel(excel) {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.post(
          environment.apiBaseUrl + "/student/uploadExcel",
          excel
        );
        await resp.subscribe(
          async (res: any) => {
            this.spinner.hide();
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400 || 500) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Student Excel Upload Failed"
              );
              reject({
                error: ex.error || ex || "Student Excel Upload Failed",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.error || ex || "Student Excel Upload Failed",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getStudentList() {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/students"
        );
        await resp.subscribe(
          async (res: any) => {
            this.spinner.hide();
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Students Fetch Error!"
              );
              reject({ error: ex.message || ex || "Students Fetch Error!" });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({ error: ex.message || ex || "Students Fetch Error!" });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllStudentCount() {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/allstudentcount"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Students Count Fetch Error!"
              );
              reject({
                error: ex.message || ex || "Students Count Fetch Error!",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Students Count Fetch Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getDateRangeFilter(startdate: string, enddate: string) {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl +
            `/allstudentsdatefilter/${startdate}/${enddate}`
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Date Filter Error!"
              );
              reject({
                error: ex.message || ex || "Date Filter Error!",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Date Filter Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllMaleCount() {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/allstudents/male"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Male Count Error!"
              );
              reject({
                error: ex.message || ex || "Male Count Error!",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Male Count Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllFemaleCount() {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.get(
          environment.apiBaseUrl + "/allstudents/female"
        );
        await resp.subscribe(
          async (res: any) => {
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Female Count Error!"
              );
              reject({
                error: ex.message || ex || "Female Count Error!",
              });
            } else {
              this.spinner.hide();
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

  async putStudent(student: any) {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.put(
          environment.apiBaseUrl + `/student/${student._id}`,
          student
        );
        await resp.subscribe(
          async (res: any) => {
            this.spinner.hide();
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Student Update Error!"
              );
              reject({
                error: ex.message || ex || "Student Update Error!",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Student Update Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteStudent(_id: string) {
    this.spinner.show();
    return await new Promise(async (resolve, reject) => {
      try {
        const resp: any = await this.http.delete(
          environment.apiBaseUrl + `/student/${_id}`
        );
        await resp.subscribe(
          async (res: any) => {
            this.spinner.hide();
            resolve(res);
          },
          async (ex: any) => {
            if (ex.status === 400) {
              this.spinner.hide();
              this.toastr.warning(
                (this.serverErrorMessages = await ex.error.message),
                "Student Delete Error!"
              );
              reject({
                error: ex.message || ex || "Student Delete Error!",
              });
            } else {
              this.spinner.hide();
              this.toastr.error(
                (this.serverErrorMessages =
                  "Something went wrong. Please contact admin."),
                "Error 422"
              );
              reject({
                error: ex.message || ex || "Student Delete Error!",
              });
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}

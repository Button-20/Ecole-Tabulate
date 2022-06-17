import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxPaginationModule } from "ngx-pagination";

import { UserService } from "./features/user.service";
import { StorageServices } from "./core/storage-services.service";
import { RequestService } from "./core/request-services.service";
import { ExcelService } from "./features/excel.service";
import { StudentService } from "./features/student.service";
import { AuthInterceptor } from "./interceptor/auth.interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { RestrictGuard } from "./guards/restrict.guard";

export const providers: Array<any> = [
  RequestService,
  StorageServices,
  UserService,
  ExcelService,
  StudentService,
  AuthInterceptor,
  // AuthGuard,
  // RestrictGuard,
];

@NgModule({
  imports: [CommonModule, NgxPaginationModule],
  providers: providers,
})
export class ServicesModule {}

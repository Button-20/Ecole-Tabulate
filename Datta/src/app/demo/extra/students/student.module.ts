import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentRoutingModule } from "./student-routing.module";
import { SharedModule } from "../../../theme/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { StudentComponent } from "./student.component";
import {
  NgbButtonsModule,
  NgbDropdownModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { StudentFilterPipe } from "./filters/student-filter.pipe";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    StudentRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [StudentComponent, StudentFilterPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentModule {}

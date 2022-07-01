import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { StudentService } from "src/app/services/features/student.service";
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from "src/app/services/features/user.service";
import { ExcelService } from "src/app/services/features/excel.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"],
})
export class StudentComponent implements OnInit {
  modelForm = { present: true };
  studentForm = new FormGroup({
    _id: new FormControl(""),
    userid: new FormControl(""),
    firstname: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$"),
      ])
    ),
    lastname: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$"),
      ])
    ),
    phonenumber: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]{12}$"),
      ])
    ),
    gender: new FormControl("", Validators.required),
    email: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.email])
    ),
    dateofbirth: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
  });
  uploadForm = new FormGroup({
    source: new FormControl("", Validators.required),
    file: new FormControl(null),
    userid: new FormControl("", Validators.required),
  });
  students: any[] = [];
  search: string;
  space = " ";
  model = {
    startdate: "",
    enddate: "",
  };
  tempSearch;
  columns: any[] = [
    "Name",
    "Phone Number",
    "Gender",
    "Email",
    "Date Of Birth",
    "Address",
  ];
  data: any[] = [];
  page: number = 1;
  totalRecords: number;
  Admin: any;
  oldData: any;
  validation_messages = {
    firstname: [
      { type: "required", message: "First name is required" },
      { type: "pattern", message: "First name must be alphabet" },
    ],
    lastname: [
      { type: "required", message: "Last name is required" },
      { type: "pattern", message: "Last name must be alphabet" },
    ],
    phonenumber: [
      { type: "required", message: "Phone number is required" },
      { type: "pattern", message: "Phone number must be 12 digits" },
    ],
    email: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Email is invalid" },
    ],
    dateofbirth: [{ type: "required", message: "Date of birth is required" }],
    address: [{ type: "required", message: "Address is required" }],
  };

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public studentService: StudentService,
    public spinner: NgxSpinnerService,
    public excelService: ExcelService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    await this.refreshStudentList();
  }

  async refreshStudentList() {
    const resp: any = await this.studentService.getStudentList();
    this.students = resp;
    this.oldData = resp;
  }

  async studentFormSubmit(formData: any) {
    let form: any = formData;
    form.name = {
      firstname: formData.firstname,
      lastname: formData.lastname,
    };
    if (this.studentForm.value._id == null) {
      const resp: any = await this.studentService.postStudent(form);
      await this.refreshStudentList();
      this.modalService.dismissAll();
      this.toastr.success(
        "Student has been created successfully",
        "Student Posted"
      );
    } else {
      const resp: any = await this.studentService.putStudent(form);
      await this.refreshStudentList();
      this.modalService.dismissAll();
      this.toastr.success(
        "Student has been updated successfully",
        "Student Updated"
      );
    }
  }

  async open(content) {
    this.studentForm.reset();
    var payload = await this.userService.getUserPayload();
    if (payload) {
      this.studentForm.patchValue({
        userid: payload._id,
      });
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  async onDelete(_id: string) {
    if (confirm("Are you sure you want to delete this record?") == true) {
      await this.studentService.deleteStudent(_id);
      await this.refreshStudentList();
      this.toastr.success(
        "Student has been deleted successfully",
        "Student Deleted"
      );
    }
  }

  onEdit(content, student: any) {
    console.log(student);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    this.studentForm.patchValue(student);
    this.studentForm.patchValue({
      firstname: student.name.firstname,
      lastname: student.name.lastname,
      dateofbirth: this.formattedDate(student.dateofbirth),
    });
  }

  formattedDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  async startSearch(startdate, enddate) {
    const resp: any = await this.studentService.getDateRangeFilter(
      startdate,
      enddate
    );
    this.students = resp;
  }

  async clearSearch() {
    this.search = "";

    this.model = {
      startdate: "",
      enddate: "",
    };

    this.students = this.oldData;
  }

  openUpload(content) {
    this.uploadForm.reset();
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  async onFileChange(event) {
    var payload = await this.userService.getUserPayload();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        file: file,
        userid: payload._id,
      });
    }
  }

  async uploadExcel() {
    const formData = new FormData();
    formData.append("file", this.uploadForm.get("file").value);
    formData.append("userid", this.uploadForm.get("userid").value);
    const resp: any = await this.studentService.postStudentExcel(formData);
    this.toastr.success(resp.message, "File Uploaded");
    await this.refreshStudentList();
    this.modalService.dismissAll();
  }

  downloadExcel() {
    this.students.forEach((student) => {
      let data = {
        Name: student.name.firstname + " " + student.name.lastname,
        PhoneNumber: student.phonenumber,
        Gender: student.gender,
        Email: student.email,
        DateOfBirth: this.formattedDate(student.dateofbirth),
        Address: student.address,
      };
      this.data.push(data);
    });
    this.excelService.exportAsExcelFile(
      "Student Details",
      "",
      this.columns,
      this.data,
      [],
      "Student__Exports",
      "Students"
    );
  }

  get firstname() {
    return this.studentForm.get("firstname");
  }

  get lastname() {
    return this.studentForm.get("lastname");
  }

  get phonenumber() {
    return this.studentForm.get("phonenumber");
  }

  get email() {
    return this.studentForm.get("email");
  }

  get dateofbirth() {
    return this.studentForm.get("dateofbirth");
  }

  get address() {
    return this.studentForm.get("address");
  }
}

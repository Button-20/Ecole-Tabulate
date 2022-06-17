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
    _id: new FormControl("", Validators.required),
    userid: new FormControl("", Validators.required),
    firstname: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required),
    phonenumber: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
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

  downloadPDF() {
    // this.attendanceService.attendance.forEach((attendance) => {
    //   let data = {
    //     ClassName: attendance.classname,
    //     MemberName: attendance.membername,
    //     Date: this.formattedDate(attendance.date),
    //     Temperature: attendance.temperature,
    //     Event: attendance.event,
    //     Present: attendance.present ? "Yes" : "No",
    //   };
    //   this.data.push(data);
    // });
    // var props = {
    //   outputType: OutputType.Save,
    //   returnJsPDFDocObject: true,
    //   fileName: Date.now() + "__Finances__Exports",
    //   orientationLandscape: false,
    //   logo: {
    //     src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
    //     width: 53.33, //aspect ratio = width/height
    //     height: 26.66,
    //     margin: {
    //       top: 0, //negative or positive num, from the current position
    //       left: 0, //negative or positive num, from the current position
    //     },
    //   },
    //   business: {
    //     name: "Business Name",
    //     address: "Albania, Tirane ish-Dogana, Durres 2001",
    //     phone: "(+233) 55 065 3404",
    //     email: "jasonaddy51@gmail.com",
    //     email_1: "info@example.al",
    //     website: "www.example.al",
    //   },
    //   contact: {
    //     label: "Invoice issued for:",
    //     name: "Client Name",
    //     address: "Albania, Tirane, Astir",
    //     phone: "(+355) 069 22 22 222",
    //     email: "client@website.al",
    //     otherInfo: "www.website.al",
    //   },
    //   invoice: {
    //     label: "Invoice #: ",
    //     num: 19,
    //     invDate: "Payment Date: 01/01/2021 18:12",
    //     invGenDate: "Invoice Date: 02/02/2021 10:17",
    //     headerBorder: false,
    //     tableBodyBorder: false,
    //     header: this.columns,
    //     table: Array.from(this.data, (item, index) => [
    //       // index + 1,
    //       item.ClassName,
    //       item.MemberName,
    //       this.formattedDate(item.Date),
    //       item.Temperature,
    //       item.Event,
    //       item.Present ? "Yes" : "No",
    //     ]),
    //     invTotalLabel: "Total:",
    //     invTotal: "145,250.50",
    //     invCurrency: "ALL",
    //     row1: {
    //       col1: "VAT:",
    //       col2: "20",
    //       col3: "%",
    //       style: {
    //         fontSize: 10, //optional, default 12
    //       },
    //     },
    //     row2: {
    //       col1: "SubTotal:",
    //       col2: "116,199.90",
    //       col3: "ALL",
    //       style: {
    //         fontSize: 10, //optional, default 12
    //       },
    //     },
    //     invDescLabel: "Invoice Note",
    //     invDesc:
    //       "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
    //   },
    //   footer: {
    //     text: "The invoice is created on a computer and is valid without the signature and stamp.",
    //   },
    //   pageEnable: true,
    //   pageLabel: "Page ",
    // };
    // const pdfObject = jsPDFInvoiceTemplate(props);
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

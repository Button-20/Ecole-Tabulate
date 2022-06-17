import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/features/user.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  model = { loginPermission: true };
  closeResult = "";
  userForm = new FormGroup({
    _id: new FormControl(""),
    classname: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    fullname: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    phonenumber: new FormControl("", [
      Validators.required,
      Validators.maxLength(10),
    ]),
    address: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    occupation: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    role: new FormControl(""),
  });
  showPass = true;
  search: string;
  users: any;

  constructor(
    public userService: UserService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.refreshUserList();
  }

  async refreshUserList() {
    const resp: any = await this.userService.getUserList();
    this.users = resp;
  }

  async userFormSubmit() {
    if (this.userForm.value._id == null) {
      const resp: any = await this.userService.postUser(this.userForm.value);
      await this.refreshUserList();
      this.modalService.dismissAll();
      this.toastr.success("User has been created successfully", "User Posted");
    } else {
      const resp: any = await this.userService.putUser(this.userForm.value);
      await this.refreshUserList();
      this.modalService.dismissAll();
      this.toastr.success("User has been updated successfully", "User Updated");
    }
  }

  open(content) {
    this.userForm.reset();
    this.userForm.patchValue({
      loginPermission: this.model.loginPermission,
    });
    this.showPass = true;
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  async onDelete(_id: string) {
    if (confirm("Are you sure you want to delete this record?") == true) {
      const resp: any = await this.userService.deleteUser(_id);
      await this.refreshUserList();
      this.toastr.success("User has been deleted successfully", "User Deleted");
    }
  }

  onEdit(content, user: any) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    this.showPass = false;
    console.log(user);

    this.userForm.patchValue(user);
  }
}

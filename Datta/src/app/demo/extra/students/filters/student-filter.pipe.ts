import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "studentFilter",
})
export class StudentFilterPipe implements PipeTransform {
  transform(student: any[], searchTerm: string): any[] {
    if (!student || !searchTerm) return student;

    return student.filter(
      (student: any) =>
        student.name.firstname
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        student.name.lastname
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        student.email
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        student.phonenumber
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        student.dateofbirth
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
    );
  }
}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchFilter",
})
export class SearchFilterPipe implements PipeTransform {
  transform(user: any[], searchTerm: string): any[] {
    if (!user || !searchTerm) return user;

    return user.filter(
      (user) =>
        user.fullname
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        user.email
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()) ||
        user.phonenumber.toString().includes(searchTerm.toLocaleLowerCase())
    );
  }
}

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./services/guards/auth.guard";
import { RestrictGuard } from "./services/guards/restrict.guard";
import { AdminComponent } from "./theme/layout/admin/admin.component";
import { AuthComponent } from "./theme/layout/auth/auth.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard/default",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./demo/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "basic",
        loadChildren: () =>
          import("./demo/ui-elements/ui-basic/ui-basic.module").then(
            (m) => m.UiBasicModule
          ),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("./demo/pages/form-elements/form-elements.module").then(
            (m) => m.FormElementsModule
          ),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./demo/pages/tables/tables.module").then(
            (m) => m.TablesModule
          ),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./demo/pages/core-chart/core-chart.module").then(
            (m) => m.CoreChartModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./demo/extra/users/users.module").then((m) => m.UsersModule),
        canActivate: [RestrictGuard],
      },
      {
        path: "students/record",
        loadChildren: () =>
          import("./demo/extra/students/student.module").then(
            (m) => m.StudentModule
          ),
      },
    ],
  },
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import("./demo/pages/authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard/default",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

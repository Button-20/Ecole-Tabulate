import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { StudentService } from "src/app/services/features/student.service.js";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { UserService } from "src/app/services/features/user.service";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  males: number = 0;
  females: number = 0;
  students: number = 0;
  value = [];
  malesPercent: number = 0;
  femalesPercent: number = 0;
  users: number = 0;
  admins: number = 0;

  constructor(
    public userService: UserService,
    public studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    setTimeout(() => {
      const data = {
        labels: ["Males", "Females"],
        datasets: [
          {
            label: "Attendance Temp. Chart",
            data: [this.males, this.females],
            backgroundColor: ["#44075e", "red"],
            hoverOffset: 4,
          },
        ],
      };
      var covidPieChart = new Chart("myGenderChart", {
        type: "pie",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, 1000);
    await this.refreshAllMaleCount();
    await this.refreshAllFemaleCount();
    await this.refreshAllStudentsCount();
    await this.refreshAllUsersCount();
    await this.refreshAllAdminsCount();
  }

  /////////////////////////////////////////------Admin-------/////////////////////////////////////////////////////

  async refreshAllStudentsCount() {
    const resp: any = await this.studentService.getAllStudentCount();
    this.students = resp;
  }

  async refreshAllMaleCount() {
    const total: any = await this.studentService.getAllStudentCount();
    const resp: any = await this.studentService.getAllMaleCount();
    this.males = resp;
    this.malesPercent = this.calculatePercent(total, this.males);
  }

  async refreshAllFemaleCount() {
    const total: any = await this.studentService.getAllStudentCount();
    const resp: any = await this.studentService.getAllFemaleCount();
    this.females = resp;
    this.femalesPercent = this.calculatePercent(total, this.females);
  }

  async refreshAllUsersCount() {
    const resp: any = await this.userService.getAllUsersCount();
    this.users = resp;
  }

  async refreshAllAdminsCount() {
    const resp: any = await this.userService.getAllAdminsCount();
    this.admins = resp;
  }

  /////////////////////////////////////////------Functions-------/////////////////////////////////////////////////////

  generateRandomColors(length) {
    var colors = [];
    while (colors.length < length) {
      let rgb = [];
      for (var i = 0; i < 3; i++) rgb.push(Math.floor(Math.random() * 255));

      colors.push("rgb(" + rgb.join(",") + ")");
    }
    return colors;
  }

  calculatePercent(totalMembers, totalEntity) {
    let percent: number;
    percent = (totalEntity / totalMembers) * 100;
    return percent;
  }

  calculateDailyAverage(totalSales) {
    let dailyAverage: number;
    dailyAverage = totalSales / 7;
    return dailyAverage;
  }

  calculateMonthlyAverage(totalSales) {
    let monthlyAverage: number;
    monthlyAverage = totalSales / 12;
    return monthlyAverage;
  }

  calculateYearlyAverage(totalSales, filteredData) {
    let yearlyAverage: number;
    yearlyAverage = totalSales / filteredData.length;
    return yearlyAverage;
  }
}

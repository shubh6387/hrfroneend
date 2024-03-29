import { getLocaleDateFormat } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-attendance-admin",
  templateUrl: "./attendance-admin.component.html",
  styleUrls: ["./attendance-admin.component.css"],
})
export class AttendanceAdminComponent implements OnInit {
  public monthlyPunch: any;
  public currentDate: any;
  public employeeData = [];
  public attenArry = [];
  public adminId: any;
  public day: any;
  public month: any;
  public monthlyPunchData: any;
  lstAttandance: any;
  public pipe = new DatePipe("en-US");
  lstPunch: any;
  public todayDate = new Date();

  constructor(private http: HttpClient) {
    this.adminId = sessionStorage.getItem("adminId");
    this.daysInMonth();
  }

  ngOnInit() {
    this.getData();
  }

  attendances: any = [];
  getData() {
    this.http
      .get(
        "http://localhost:8443/admin/monthlyAttandance/getData" +
          "/" +
          this.adminId
      )
      .subscribe((res) => {
        this.lstAttandance = res;

        this.lstAttandance.map((item) => {
          var arr = [];
          for (let i = 0; i < this.day; i++) {
            arr.push("A");
          }

          item.monthlyPunchData.map((data) => {
            var dateDay = data.date.split("-");

            var noDay = Number(dateDay[0]);
            var noMonth = Number(dateDay[1]);

            if (noDay < this.day && noMonth === this.month) {
              if (data.status === 0) {
                arr[noDay - 1] = "A";
              } else if (data.status === 1) {
                arr[noDay - 1] = "P/2";
              } else if (data.status === 3) {
                arr[noDay - 1] = "P";
              }
            }
          });

          var obj = {
            name: item.employeeName,
            attendDate: arr,
          };

          this.employeeData.push(obj);
        });
      });
  }

  daysInMonth() {
    var dt = new Date();
    var month = dt.getMonth() + 1;
    this.month = month;

    var year = dt.getFullYear();
    var dayInMonth = new Date(year, month, 0).getDate();
    this.day = dayInMonth;

    return dayInMonth;
  }
}

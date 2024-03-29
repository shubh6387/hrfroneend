import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { id } from "src/assets/all-modules-data/id";
import { AllModulesService } from "../../all-modules.service";

declare const $: any;
@Component({
  selector: "app-performance-appraisal",
  templateUrl: "./performance-appraisal.component.html",
  styleUrls: ["./performance-appraisal.component.css"],
})
export class PerformanceAppraisalComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  lstData: any[];
  url: any = "performanceappraisal";

  public tempId: any;
  public editId: any;
  public adminId: any;
  id: any;

  public addApparaisalForm: FormGroup;
  public editApparaisalForm: FormGroup;
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  lstEmployee: any;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.adminId = sessionStorage.getItem("adminId");
  }

  ngOnInit() {
    this.loadData();

    /// validation for apparaisal form
    this.addApparaisalForm = this.formBuilder.group({
      EmployeeName: ["", [Validators.required]],
      SelectDate: ["", [Validators.required]],
      StatusName: ["", [Validators.required]],
    });

    this.editApparaisalForm = this.formBuilder.group({
      EmployeeName: ["", [Validators.required]],
      SelectDate: ["", [Validators.required]],
      StatusName: ["", [Validators.required]],
    });
    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  }

  // Get  apparaisal Api Call
  loadData() {
    this.http.get("http://localhost:8443/admin/performance/performance_appraisal/getData" + "/" + this.adminId).subscribe((data: any) => {
      this.lstData = data;
      this.rows = this.lstData;
      this.srch = [...this.rows];
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Add  apparaisal type  Modal Api Call
  addApparaisal() {
    if (this.addApparaisalForm.invalid) {
      this.markFormGroupTouched(this.addApparaisalForm)
      return
    }
    if (this.addApparaisalForm.valid) {
      let apparaisalDate = this.pipe.transform(
        this.addApparaisalForm.value.SelectDate,
        "dd-MM-yyyy"
      );
      let obj = {
        adminId: this.adminId,
        employeeName: this.addApparaisalForm.value.EmployeeName,
        apparaisaldate: apparaisalDate,
        designation: "Web Designer",
        department: "Web development",
        status: this.addApparaisalForm.value.StatusName,
      };
      //console.log("obj", obj)
      this.http.post("http://localhost:8443/admin/performance/performance_appraisal/create", obj).subscribe((data: any) => {
        //console.log(data, "postApi")
        this.loadData();
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });

      $("#add_appraisal").modal("hide");
      this.addApparaisalForm.reset();
      this.toastr.success("Apparaisal added sucessfully...!", "Success");
    }
  }
  // Edit apparaisal Modal Api Call

  editApparaisal() {
    if (this.editApparaisalForm.valid) {
      let apparaisalDate = this.pipe.transform(
        this.editApparaisalForm.value.SelectDate,
        "dd-MM-yyyy"
      );
      this.id = this.editId
      let obj = {
        employeeName: this.editApparaisalForm.value.EmployeeName,
        apparaisaldate: apparaisalDate,
        designation: "Web Designer",
        department: "Web development",
        status: this.editApparaisalForm.value.StatusName,

      };
      this.http.patch("http://localhost:8443/admin/performance/performance_appraisal/update" + "/" + this.id, obj).subscribe((data: any) => {
        //console.log("updateApi", data)
        this.loadData();
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });

      $("#edit_appraisal").modal("hide");
      this.toastr.success("Apparaisal updated sucessfully...!", "Success");
    }
  }
  edit(value) {
    this.editId = value;
    const index = this.lstData.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.lstData[index];
    this.editApparaisalForm.setValue({
      EmployeeName: toSetValues.employee,
      SelectDate: toSetValues.apparaisaldate,
      StatusName: toSetValues.status
    });
  }

  // Delete apparaisal Modal Api Call


  deleteApparaisal() {

    this.id = this.tempId;
    let obj = {
      status: 2,
    }

    this.http.patch("http://localhost:8443/admin/performance/performance_appraisal/delete" + "/" + this.id, obj).subscribe((data: any) => {
      //console.log(data, "deleteApi");
      this.loadData();
      $("#datatable").DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    });

    $("#delete_appraisal").modal("hide");
    this.toastr.success("Record deleted sucessfully...!", "Success");
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  updateStatus(val, id) {
    this.http.patch("http://localhost:8443/admin/performance/performance_appraisal/update" + "/" + id, { status: val }).subscribe((data: any) => {
      //console.log("updateStatus", data);
      this.loadData();;
    })
  }
  getAllemployeeData() {
    this.http
      .get(
        "http://localhost:8443/admin/allemployees/getallEmployee" +
        "/" +
        this.adminId
      )
      .subscribe((data: any) => {
        //console.log("getApi", data);

        this.lstEmployee = data;
        // this.rows = this.lstEmployee;
        // this.srch = [...this.rows];
      });

  }
}


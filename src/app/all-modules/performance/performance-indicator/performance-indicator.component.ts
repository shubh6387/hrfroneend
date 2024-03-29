import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AllModulesService } from "../../all-modules.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { HttpClient } from "@angular/common/http";

declare const $: any;
@Component({
  selector: "app-performance-indicator",
  templateUrl: "./performance-indicator.component.html",
  styleUrls: ["./performance-indicator.component.css"],
})
export class PerformanceIndicatorComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  lstData: any[];
  url: any = "performanceindicator";

  public tempId: any;
  public editId: any;
  public id: any
  public addIndicatorForm: FormGroup;
  public editIndicatorForm: FormGroup;
  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public adminId: any;
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.adminId = sessionStorage.getItem("adminId")
  }

  ngOnInit() {
    this.loadData();
    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };

    this.addIndicatorForm = this.formBuilder.group({
      designationName: ["", [Validators.required]],
      experienceName: ["", [Validators.required]],
      marketingName: ["", [Validators.required]],
      AdministrationName: ["", [Validators.required]],
      presentationName: ["", [Validators.required]],

      QualityName: ["", [Validators.required]],
      effientcyName: ["", [Validators.required]],
      integrityName: ["", [Validators.required]],

      professionalismName: ["", [Validators.required]],
      teamWork: ["", [Validators.required]],
      criticalName: ["", [Validators.required]],

      ManagementName: ["", [Validators.required]],
      AttendanceName: ["", [Validators.required]],
      deadLineName: ["", [Validators.required]],
      statusName: ["", [Validators.required]],
    });

    this.editIndicatorForm = this.formBuilder.group({
      designationName: ["", [Validators.required]],
      experienceName: ["", [Validators.required]],
      marketingName: ["", [Validators.required]],
      AdministrationName: ["", [Validators.required]],
      presentationName: ["", [Validators.required]],

      QualityName: ["", [Validators.required]],
      effientcyName: ["", [Validators.required]],
      integrityName: ["", [Validators.required]],

      professionalismName: ["", [Validators.required]],
      teamWork: ["", [Validators.required]],
      criticalName: ["", [Validators.required]],

      ManagementName: ["", [Validators.required]],
      AttendanceName: ["", [Validators.required]],
      deadLineName: ["", [Validators.required]],
      statusName: ["", [Validators.required]],
    });
  }

  // Get  trainer Api Call
  loadData() {
    this.http.get("http://localhost:8443/admin/performance/performance_indicator/getData" + "/" + this.adminId).subscribe((data: any) => {
      this.lstData = data;
      this.dtTrigger.next();
      this.rows = this.lstData;
      this.srch = [...this.rows];
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Add  goal type  Modal Api Call
  addIndicator() {
    if (this.addIndicatorForm.invalid) {
      this.markFormGroupTouched(this.addIndicatorForm)
      return
    }
    if (this.addIndicatorForm.valid) {
      let obj = {
        adminId: this.adminId,
        designation: this.addIndicatorForm.value.designationName,
        department: "Web Development",
        experience: this.addIndicatorForm.value.experienceName,
        Marketing: this.addIndicatorForm.value.marketingName,
        adminstartion: this.addIndicatorForm.value.AdministrationName,
        presentationskil: this.addIndicatorForm.value.presentationName,

        qualityofwork: this.addIndicatorForm.value.QualityName,
        effientcy: this.addIndicatorForm.value.effientcyName,
        integrirty: this.addIndicatorForm.value.integrityName,

        professionalism: this.addIndicatorForm.value.professionalismName,
        teamwork: this.addIndicatorForm.value.teamWork,
        criticalthinking: this.addIndicatorForm.value.criticalName,

        conflictmanagement: this.addIndicatorForm.value.ManagementName,
        attendance: this.addIndicatorForm.value.AttendanceName,
        meetdeadline: this.addIndicatorForm.value.deadLineName,
        addedBy: "Mike Litorus",
        createdBy: "28 Feb 2019",
        status: this.addIndicatorForm.value.statusName,
      };
      //console.log("obj", obj);
      this.http.post("http://localhost:8443/admin/performance/performance_indicator/create", obj).subscribe((data: any) => {
        this.loadData();
        //console.log(data, "postApi")
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });

      $("#add_indicator").modal("hide");
      this.addIndicatorForm.reset();
      this.toastr.success("Indicator added sucessfully...!", "Success");
    }
  }

  editIndicator() {
    if (this.editIndicatorForm.valid) {
      this.id = this.editId
      let obj = {
        designation: this.editIndicatorForm.value.designationName,
        department: "Web Development",
        experience: this.editIndicatorForm.value.experienceName,
        Marketing: this.editIndicatorForm.value.marketingName,
        adminstartion: this.editIndicatorForm.value.AdministrationName,
        presentationskil: this.editIndicatorForm.value.presentationName,

        qualityofwork: this.editIndicatorForm.value.QualityName,
        effientcy: this.editIndicatorForm.value.effientcyName,
        integrirty: this.editIndicatorForm.value.integrityName,

        professionalism: this.editIndicatorForm.value.professionalismName,
        teamwork: this.editIndicatorForm.value.teamWork,
        criticalthinking: this.editIndicatorForm.value.criticalName,

        conflictmanagement: this.editIndicatorForm.value.ManagementName,
        attendance: this.editIndicatorForm.value.AttendanceName,
        meetdeadline: this.editIndicatorForm.value.deadLineName,
        addedBy: "Mike Litorus",
        createdBy: "28 Feb 2019",
        status: this.editIndicatorForm.value.statusName,

      };
      this.http.patch("http://localhost:8443/admin/performance/performance_indicator/update" + "/" + this.editId, obj).subscribe((data: any) => {
        //console.log("updateApi", data)
        this.loadData();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });

      $("#edit_indicator").modal("hide");
      this.toastr.success("Indicator Updated sucessfully...!", "Success");
    }
  }

  // To Get The indicator type Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.lstData.findIndex((item) => {
      return item.id === value;
    });
    let toSetValues = this.lstData[index];
    this.editIndicatorForm.setValue({
      designationName: toSetValues.designation,
      experienceName: toSetValues.experience,
      marketingName: toSetValues.Marketing,
      AdministrationName: toSetValues.adminstartion,
      presentationName: toSetValues.presentationskil,
      QualityName: toSetValues.qualityofwork,
      effientcyName: toSetValues.effientcy,
      integrityName: toSetValues.integrirty,
      professionalismName: toSetValues.professionalism,
      teamWork: toSetValues.teamwork,
      criticalName: toSetValues.criticalthinking,
      ManagementName: toSetValues.conflictmanagement,
      AttendanceName: toSetValues.attendance,
      deadLineName: toSetValues.meetdeadline,
      statusName: toSetValues.status,
    });
  }

  deleteIndicator() {
    let obj = {
      status: 2,
    }
    this.http.patch("http://localhost:8443/admin/performance/performance_indicator/delete" + "/" + this.tempId, obj).subscribe((data) => {
      //console.log("deleteApi", data)
      this.loadData();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      $("#delete_indicator").modal("hide");
      this.toastr.success("Indicator  deleted sucessfully..!", "Success");
    });
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}

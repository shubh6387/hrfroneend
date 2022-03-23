import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AllModulesService } from "src/app/all-modules/all-modules.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { HttpClient } from "@angular/common/http";

declare const $: any;
@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public url: any = "employeelist";
  public tempId: any;
  public editId: any;
  public departments: any;
  public designations: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;

  public pipe = new DatePipe("en-US");
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public DateJoin;
  Holidays = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Leaves = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Clients = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Projects = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Tasks = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Chats = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  Assets = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];

  TimingSheets = [
    { id: 0, read: false },
    { id: 1, write: false },
    { id: 2, create: false },
    { id: 3, delete: false },
    { id: 4, import: false },
    { id: 5, export: false },
  ];
  constructor(
    private srvModuleService: AllModulesService,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    console.log("new", this.Holidays[0].read);
    this.getDepartments();
    this.getDesignation();
  }

  public getDepartments() {
    this.http
      .get("http://localhost:8443/admin/department/getData")
      .subscribe((data) => {
        this.departments = data;
      });
  }
  public getDesignation() {
    this.http
      .get("http://localhost:8443/admin/designation/getData")
      .subscribe((data) => {
        this.designations = data;
      });
  }
  ngOnInit() {
    // for floating label

    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.loadEmployee();
    // add employee form validation
    this.addEmployeeForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      ConfirmPassword: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
      Designation: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      JoinDate: ["", [Validators.required]],
      CompanyName: ["", [Validators.required]],
      EmployeeID: ["", [Validators.required]],
    });

    // edit form validation
    this.editEmployeeForm = this.formBuilder.group({
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      ConfirmPassword: ["", [Validators.required]],
      DepartmentName: ["", [Validators.required]],
      Designation: ["", [Validators.required]],
      Email: ["", [Validators.required]],
      PhoneNumber: ["", [Validators.required]],
      JoinDate: ["", [Validators.required]],
      CompanyName: ["", [Validators.required]],
      EmployeeID: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }
  // manually rendering Data table

  rerender(): void {
    $("#datatable").DataTable().clear();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });

    this.lstEmployee = [];
    this.loadEmployee();
    //

    setTimeout(() => {
      this.dtTrigger.next();
    }, 2000);
  }

  // Get Employee  Api Call
  loadEmployee() {
    // this.srvModuleService.get(this.url).subscribe((data) => {
    this.http
      .get("http://localhost:8443/admin/allemployees/getallEmployee")
      .subscribe((data) => {
        console.log(data);
        this.lstEmployee = data;
        this.rows = this.lstEmployee;
        this.srch = [...this.rows];
      });
  }

  // Add employee  Modal Api Call
  addEmployee() {
    let DateJoin = this.pipe.transform(
      this.addEmployeeForm.value.JoinDate,
      "dd-MM-yyyy"
    );
    this.Holidays = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];

    this.Leaves = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Clients = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Projects = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Tasks = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Chats = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Assets = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.TimingSheets = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    let obj = {
      firstname: this.addEmployeeForm.value.FirstName,
      lastname: this.addEmployeeForm.value.LastName,
      username: this.addEmployeeForm.value.UserName,
      email: this.addEmployeeForm.value.Email,
      password: this.addEmployeeForm.value.Password,
      confirmpassword: this.addEmployeeForm.value.ConfirmPassword,
      employeeId: this.addEmployeeForm.value.EmployeeID,
      joindate: DateJoin,
      phone: this.addEmployeeForm.value.PhoneNumber,
      company: this.addEmployeeForm.value.CompanyName,
      department: this.addEmployeeForm.value.DepartmentName,
      designation: this.addEmployeeForm.value.Designation,
      mobile: this.addEmployeeForm.value.mobile,
      role: this.addEmployeeForm.value.role,
      Holidays: this.Holidays,
      Leaves: this.Leaves,
      Clients: this.Clients,
      Projects: this.Projects,
      Tasks: this.Tasks,
      Chats: this.Chats,
      Assets: this.Assets,
      TimingSheets: this.TimingSheets,
    };
    this.http
      .post("http://localhost:8443/admin/allemployees/addemployee", obj)
      .subscribe((data) => {
        console.log(data);
        this.loadEmployee();
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });

    $("#add_employee").modal("hide");
    this.addEmployeeForm.reset();
    this.toastr.success("Employeee added sucessfully...!", "Success");
  }

  // to know the date picker changes
  from(data) {
    this.DateJoin = this.pipe.transform(data, "dd-MM-yyyy");
  }

  // edit modal api call
  editEmployee() {
    let employeeId = this.editId;
    let obj = {
      firstname: this.editEmployeeForm.value.FirstName,
      lastname: this.editEmployeeForm.value.LastName,
      username: this.editEmployeeForm.value.UserName,
      email: this.editEmployeeForm.value.Email,
      password: this.editEmployeeForm.value.Password,
      confirmpassword: this.editEmployeeForm.value.ConfirmPassword,
      employeeId: this.editEmployeeForm.value.EmployeeID,
      joindate: this.editEmployeeForm.value.JoinDate,
      phone: this.editEmployeeForm.value.PhoneNumber,
      company: this.editEmployeeForm.value.CompanyName,
      department: this.editEmployeeForm.value.DepartmentName,
      designation: this.editEmployeeForm.value.Designation,
      mobile: this.editEmployeeForm.value.mobile,
      role: this.editEmployeeForm.value.role,
      Holidays: this.Holidays,
      Leaves: this.Leaves,
      Clients: this.Clients,
      Projects: this.Projects,
      Tasks: this.Tasks,
      Chats: this.Chats,
      Assets: this.Assets,
      TimingSheets: this.TimingSheets,
      // id: this.editId,
    };
    // this.srvModuleService.update(obj, this.url).subscribe((data1) => {
    this.http
      .patch(
        "http://localhost:8443/admin/allemployees/update" + "/" + employeeId,
        obj
      )
      .subscribe((data) => {
        console.log(data);
        this.loadEmployee();
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });

    $("#edit_employee").modal("hide");
    this.toastr.success("Employeee Updated sucessfully...!", "Success");
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.Holidays = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];

    this.Leaves = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Clients = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Projects = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Tasks = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Chats = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.Assets = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.TimingSheets = [
      { id: 0, read: false },
      { id: 1, write: false },
      { id: 2, create: false },
      { id: 3, delete: false },
      { id: 4, import: false },
      { id: 5, export: false },
    ];
    this.editId = value;

    const index = this.lstEmployee.findIndex((item) => {
      return item.employeeId === value;
    });
    let toSetValues = this.lstEmployee[index];
    console.log(toSetValues);
    this.editEmployeeForm.setValue({
      FirstName: toSetValues.firstName,
      LastName: toSetValues.lastName,
      UserName: toSetValues.employeeId,
      Email: toSetValues.email,
      Password: toSetValues.password,
      ConfirmPassword: toSetValues.password,
      EmployeeID: toSetValues.employeeId,
      JoinDate: toSetValues.joinDate,
      PhoneNumber: toSetValues.phone,
      CompanyName: toSetValues.company,
      DepartmentName: toSetValues.department,
      Designation: toSetValues.designation,
    });
    this.Holidays = toSetValues.Holidays;
    this.Leaves = toSetValues.Leaves;
    this.Clients = toSetValues.Clients;
    this.Projects = toSetValues.Projects;
    this.Tasks = toSetValues.Tasks;
    this.Chats = toSetValues.Chats;
    this.Assets = toSetValues.Assets;
    this.TimingSheets = toSetValues.TimingSheets;
  }

  // delete employee data api call
  deleteEmployee() {
    let employeeId = this.tempId;
    let obj = {
      status: 2,
    };
    // this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
    this.http
      .patch(
        "http://localhost:8443/admin/allemployees/delete" + "/" + employeeId,
        obj
      )
      .subscribe((data) => {
        console.log(data);
        this.loadEmployee();
        $("#datatable").DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });

    $("#delete_employee").modal("hide");
    this.toastr.success("Employee deleted sucessfully..!", "Success");
  }

  //search by Id
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.employeeId.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = [];
    this.rows.push(...temp);
  }

  //search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = [];
    this.rows.push(...temp);
  }

  //search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = [];
    this.rows.push(...temp);
  }

  //getting the status value
  getStatus(data) {
    this.statusValue = data;
  }

  checkCheckBoxvalueHolidays(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].read = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].write = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].create = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].delete = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].import = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].export = true;
      } else {
        const objIndex = this.Holidays.findIndex((obj) => obj.id == val);
        this.Holidays[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueLeaves(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].read = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].write = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].create = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].delete = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].import = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].export = true;
      } else {
        const objIndex = this.Leaves.findIndex((obj) => obj.id == val);
        this.Leaves[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueClients(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].read = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].write = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].create = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].delete = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].import = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].export = true;
      } else {
        const objIndex = this.Clients.findIndex((obj) => obj.id == val);
        this.Clients[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueProjects(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].read = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].write = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].create = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].delete = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].import = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].export = true;
      } else {
        const objIndex = this.Projects.findIndex((obj) => obj.id == val);
        this.Projects[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueTasks(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].read = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].write = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].create = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].delete = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].import = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].export = true;
      } else {
        const objIndex = this.Tasks.findIndex((obj) => obj.id == val);
        this.Tasks[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueChats(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].read = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].write = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].create = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].delete = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].import = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].export = true;
      } else {
        const objIndex = this.Chats.findIndex((obj) => obj.id == val);
        this.Chats[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueAssets(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].read = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].write = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].create = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].delete = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].import = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].export = true;
      } else {
        const objIndex = this.Assets.findIndex((obj) => obj.id == val);
        this.Assets[objIndex].export = false;
      }
    }
  }

  checkCheckBoxvalueTimingSheets(event, val) {
    if (val == 0) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].read = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].read = false;
      }
    } else if (val == 1) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].write = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].write = false;
      }
    } else if (val == 2) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].create = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].create = false;
      }
    } else if (val == 3) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].delete = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].delete = false;
      }
    } else if (val == 4) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].import = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].import = false;
      }
    } else if (val == 5) {
      if (event.target.checked == true) {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].export = true;
      } else {
        const objIndex = this.TimingSheets.findIndex((obj) => obj.id == val);
        this.TimingSheets[objIndex].export = false;
      }
    }
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}

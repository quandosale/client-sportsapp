import { Component, OnInit, ViewChild, Type, OnDestroy } from '@angular/core';
import { Patients, User, PatientsService, UserService, SharedService } from '../../services/index';
import { Message } from 'primeng/primeng';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { CONFIG } from '../../common/config';
import { ConfirmationService } from 'primeng/primeng';
declare let $: any;
@Component({

  selector: 'page_Patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent extends Type implements OnInit, OnDestroy {
  msgs: Message[] = [];
  patients: any = [];
  selectedpatient: Patients;
  users: User[];
  user: any = {};
  myPatients: Patients[] = [];
  isOn: boolean;
  src: string = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  data2: any = {};
  cropperSettings2: CropperSettings;
  display: boolean = false;
  onRegister: Boolean = true;
  busy: Promise<any>;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  constructor(
    private patientservice: PatientsService,
    private userService: UserService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService
  ) {
    super();
    this.isOn = true;
    // Cropper settings 2
    this.cropperSettings2 = new CropperSettings();
    this.cropperSettings2.width = 200;
    this.cropperSettings2.height = 200;
    this.cropperSettings2.keepAspect = false;

    this.cropperSettings2.croppedWidth = 200;
    this.cropperSettings2.croppedHeight = 200;

    this.cropperSettings2.canvasWidth = 450;
    this.cropperSettings2.canvasHeight = 300;
    this.cropperSettings2.minWidth = 100;
    this.cropperSettings2.minHeight = 100;

    this.cropperSettings2.rounded = true;
    this.cropperSettings2.minWithRelativeToResolution = false;

    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings2.noFileInput = true;
    this.data2 = {};
    this.data2.image = '';
  }

  ngOnInit(): void {
    this.getPatientByDoctor();
    this.selectedpatient = new Patients();
  }
  ngOnDestroy(): void {
    document.body.style.backgroundColor = 'white';
  }

  /////////////////// show Dialog  //////////////////

  showDialog() {
    this.data2.image = this.src;
    this.display = true;
  }


  openNav() {
    document.getElementById('main').style.marginRight = '400px';
    document.body.style.backgroundColor = 'rgba(0,0,0,0.2)';
    document.body.style.transition = 'all 1s ease';
  }
  openNavNew() {
    this.selectedpatient = new Patients();
    this.selectedpatient.gender = 'Male';
    this.src = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
    this.isOn = true;
    document.getElementById('mySidenav').style.width = '400px';
    this.openNav();
  }
  openNavEdit(patient: Patients) {
    this.selectedpatient = patient;
    this.src = this.selectedpatient.photo.toString();
    document.getElementById('mySidenavEdit').style.width = '400px';
    this.openNav();
  }
  openNavEditWithOutP() {
    document.getElementById('mySidenavEdit').style.width = '400px';
    this.openNav();
  }

  openNavDelete(patient: Patients) {
    this.selectedpatient = patient;
    this.src = this.selectedpatient.photo.toString();
    document.getElementById('mySidenavDelete').style.width = '400px';
    this.openNav();
  }
  openNavDeleteWithOutP() {
    document.getElementById('mySidenavDelete').style.width = '400px';
    this.openNav();
  }
  // PatientSelect(patient: Patients) {
  //   this.selectedpatient = patient;
  //   this.src = this.selectedpatient.photo.toString();
  //   this.isOn = false;
  // }
  index: number = 0;
  PatientSelect(index: any, id: any, photo: any, doctorID: any, doctorLastname: any, firstname: any, lastname: any, birthday: any, height: any, gender: any, phone: any, location: any, city: any, owner: any) {
    this.index = index;
    this.selectedpatient = new Patients;
    this.selectedpatient._id = id;
    this.selectedpatient.firstname = firstname;
    this.selectedpatient.lastname = lastname;
    this.selectedpatient.height = height;
    this.selectedpatient.gender = gender;
    this.selectedpatient.phone = phone;
    this.selectedpatient.location = location;
    this.selectedpatient.birthday = birthday;
    this.selectedpatient.city = city;
    this.selectedpatient.owner = owner;
    this.selectedpatient.doctor.id = doctorID;
    this.selectedpatient.doctor.lastname = doctorLastname;
    this.src = photo.toString();
    this.isOn = false;
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('mySidenavEdit').style.width = '0';
    document.getElementById('mySidenavDelete').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
    document.body.style.backgroundColor = 'white';
    this.selectedpatient = new Patients();
    this.onRegister = true;
    this.isOn = true;
  }

  /////////////////////    image change  ///////////////////
  cropped(bounds: Bounds) {

  }

  fileChangeListener($event: any) {
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  imageSave() {
    this.src = this.data2.image;
    this.data2 = {};
    this.data2.image = '';
    this.display = false;
  }

  /////////////////      patientsRegister      /////////////

  patientsRegister() {
    this.selectedpatient.photo = this.src;
    this.selectedpatient.doctor.id = this.sharedService.getUser()._id;
    this.selectedpatient.doctor.lastname = this.sharedService.getUser().secondname;   /////// username to secondname
    this.selectedpatient.owner = 'MyPatient';
    // tslint:disable-next-line:curly
    if (this.selectedpatient.firstname == null ||
      this.selectedpatient.lastname == null ||
      this.selectedpatient.birthday == null ||
      this.selectedpatient.height == null ||
      this.selectedpatient.phone == null ||
      this.selectedpatient.location == null ||
      this.selectedpatient.city == null) {
      this.onRegister = false;
    } else {
      this.patientservice.register(this.selectedpatient)
        .then(res => {
          this.msgs = [];
          if (res.success) {
            this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
            this.selectedpatient._id = res.data._id;
            this.myPatients.splice(0, 0, this.selectedpatient);
            this.onRegister = true;
            this.closeNav();
          } else {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
          };
        });
    }

  }

  ////////////////////     getPatientByDoctor    and  getNetworkedPatients  ///////////////////

  getPatientByDoctor(): void {
    let userID = this.sharedService.getUser()._id;
    if (userID !== '') {
      this.user = this.sharedService.getUser();
    }
    this.busy = this.patientservice.getPatientByDoctor(userID).then(res => {
      for (let element of res.data) {
        element.birthday = this.birthdayConvert(element.birthday);
        element.photo = element.photo;                       // CONFIG.SERVER_URL +
        element.owner = 'MyPatient';
        this.myPatients.push(element);
      }
      this.patientservice.getNetworkedPatients(userID).then(res1 => {
        this.patients = res1.data;
        for (let element of res1.data) {
          element.birthday = this.birthdayConvert(element.birthday);
          element.photo = element.photo;                     // CONFIG.SERVER_URL +
          element.owner = 'Network Patient';   /// + element.doctor.lastname;
          this.myPatients.push(element);
        }
      });
    });
  }

  birthdayConvert(Birthday: any): any {
    let birthday = new Date(Birthday);
    let yyyy = birthday.getFullYear();
    let month = birthday.getMonth() + 1;
    let mm = (month / 10 >= 1) ? month : ('0' + month);
    let day = birthday.getDate();
    let dd = (day / 10 >= 1) ? day : ('0' + day);
    Birthday = `${yyyy}-${mm}-${dd}`;
    return Birthday;
  }


  /////////////////////      myPatients delect     ///////////////
  deletePatient(): void {

    this.patientservice.deletePatient(this.selectedpatient._id).then(res => {
      this.msgs = [];
      if (res.success) {
        this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
        this.myPatients.splice(this.myPatients.findIndex(res => res._id === this.selectedpatient._id), 1);
        this.closeNav();
        this.isOn = true;
      }
      else {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
      };
    });
  }

  ///////////////////////   myPatients update   //////////////////////
  updatePatient(): void {
    if (this.selectedpatient.firstname === '' ||
      this.selectedpatient.lastname === '' ||
      this.selectedpatient.birthday === null ||
      this.selectedpatient.height <= 0 ||
      this.selectedpatient.phone === '' ||
      this.selectedpatient.location === '' ||
      this.selectedpatient.city === '') {
      this.onRegister = false;
    } else {
      this.selectedpatient.photo = this.src;
      this.patientservice.updatePatient(this.selectedpatient, this.selectedpatient._id).then(res => {
        this.msgs = [];
        if (res.success) {
          this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
          this.onRegister = true;
          this.myPatients.splice(this.index, 1, this.selectedpatient);
          this.closeNav();
        } else {
          this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message })
        };
      });
    }
  }
  confirm() {
    this.confirmationService.confirm({
      message: 'Do you want to delete Patient?',
      header: 'Delete Patient',
      icon: 'fa fa-trash',
      accept: () => {
        this.deletePatient();
      }
    });
  }
}

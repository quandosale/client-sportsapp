import { Component, OnInit, ViewChild, Type } from '@angular/core';
import { PatientsService, UserService, SharedService } from '../../../services/index';
import { Message } from 'primeng/primeng';

import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { CONFIG } from '../../../common/config';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';


declare let jQuery: any;
declare let $: any;

@Component({

  selector: 'userInfomation',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [PatientsService, UserService],
})
export class UserComponent extends Type implements OnInit {

  user: any = {};
  msgs: Message[] = [];
  src: string = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
  data2: any;
  cropperSettings2: CropperSettings;
  display: boolean = false;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService
  ) {

    super();
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
    $(document).ready(function () {
      $('.btn-pref .btn').click(function () {
        $('.btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
        // $('.tab').addClass('active'); // instead of this do the below
        $(this).removeClass('btn-default').addClass('btn-primary');
      });
    });
    this.getUser();
  }


  /////////////////////    image change  ///////////////////
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
    console.log(this.src);
    this.display = false;
  }
  /////////////////////////  showDialog   ///////////////



  showDialog() {
    this.data2.image = this.src;
    this.display = true;
  }

  ////////////////////// getuser  /////////////////////

  getUser() {
    this.user = this.sharedService.getUser();
    if (this.user.photo == null) {
      this.user.photo = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
    }
    this.src = this.user.photo;
  }

  ////////////////////  update user ///////////////

  updateUser() {
    this.user.photo = this.src;
    this.userService.updateUser(this.user, this.user._id).then(res => {
      this.msgs = [];
      if (res.success) {
        this.user.photo = CONFIG.SERVER_URL + '/assets/gravatar/' + this.user._id + 'd.jpg';
        this.msgs.push({ severity: 'success', summary: 'Successful', detail: res.message });
        this.sharedService.setUser(this.user);
      } else {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: res.message });
      };
    });
  }

}










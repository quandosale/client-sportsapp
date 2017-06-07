import { Component, OnInit, Directive } from '@angular/core';
import {CONFIG} from '../../common/config';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({

    selector: 'page_firmware',
    templateUrl: './firmware.component.html',
    styleUrls: ['./firmware.component.css'],
    providers: [],
})


export class FirmwareComponent implements OnInit {
    URL = CONFIG.SERVER_URL + '/firmware/upload';

    constructor() {

    }

    ngOnInit() {

    }
    public uploader: FileUploader = new FileUploader({ url: this.URL });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
    uploadFirmware() {
        console.log('upload firmware');
    }
}
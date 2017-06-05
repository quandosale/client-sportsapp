import { Component } from '@angular/core';

@Component({
    selector: 'upgrade',
    templateUrl: './upgrade.component.html',
    styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent {
    personal = false;
    doctor = false;
    plus = false;
    reseacher = false;
    isBusy = false;
    select(v: string) {
        this.personal = false;
        this.doctor = false;
        this.plus = false;
        this.reseacher = false;
        switch (v) {
            case 'personal': this.personal = !this.personal; break;
            case 'doctor': this.doctor = !this.doctor; break;
            case 'plus': this.plus = !this.plus; break;
            case 'researcher': this.reseacher = !this.reseacher; break;
        }
    }
    process() {
        this.isBusy = true;
        setTimeout(() => {
            this.isBusy = false;
        }, 2500);

    }
}

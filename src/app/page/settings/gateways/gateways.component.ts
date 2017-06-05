import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, SharedService, ConfigService, GateWayService } from '../../../services/index';
import { Message } from 'primeng/primeng';

import { Router } from '@angular/router';

@Component({

    selector: 'gateways',
    templateUrl: './gateways.component.html',
    styleUrls: ['../setting.component.css'],
})
export class GatewaysComponent implements OnInit, OnDestroy {
    user: any = {};
    config: any = {};
    states: String[] = ['3', '5', '10', '15', '30', '60'];
    gateways: any = [];
    selectGateway: any = {};
    msgs: Message[] = [];
    display: boolean = false;
    constructor(
        private router: Router,
        private userService: UserService,
        private sharedService: SharedService,
        private configService: ConfigService,
        private gateWayService: GateWayService
    ) {


    }

    ngOnInit(): void {
        this.getUser();
    }

    ngOnDestroy(): void {
        document.body.style.backgroundColor = 'white';
    }


    getUser() {
        this.user = this.sharedService.getUser();
        this.getConfig(this.user.config);
        this.getGateWays(this.user._id);
    }

    showDialog(gateway: any) {
        this.selectGateway = gateway;
        this.display = true;
    }
    ///// getConfig  /////
    getConfig(id: any) {
        this.configService.getConfig(id).then(res => {
            if (res.success) {
                res.data[0].polling_freq = res.data[0].polling_freq;
                res.data[0].upload_freq = res.data[0].upload_freq;
                this.config = res.data[0];
            }
        });
    }
    ///// update /////
    update() {
        this.msgs = [];
        this.configService.updateConfig(this.config, this.user.config).then(res => {
            if (res.success) {
                this.msgs.push({ severity: 'success', summary: 'Successful', detail: 'Update success' });
            }
        });
    }

    ///// get gateways /////

    getGateWays(userId: any) {
        this.gateWayService.getGateWay(userId).then(res => {
            if (res.success) {
                this.gateways = res.data;
                console.log(this.gateways);
            }
        });
    }

    updateGateWay() {
        this.gateWayService.updateGateway(this.selectGateway).then(res => {
            this.display = false;
        });
    }
}










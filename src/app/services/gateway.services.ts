import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';

@Injectable()
export class GateWayService {
    constructor(public http: Http) {

    }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }


    /////////////////////////  get gateway   ///////////////////////

    getGateWay(id: String): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/gateways/get-by-doctor/' + id;
        return this.http.get(request_url)
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    //////////////////////   update gateway  /////////////////
    updateGateway(gateway: any): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/gateways/update/' + gateway._id;
        let data = {
            name: gateway.name,
            upload_freq: gateway.upload_freq,
            polling_freq: gateway.polling_freq,
            login_everytime: gateway.login_everytime
        };
        return this.http.put(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => {
                return res.json();
            })
            .catch(this.handleError);
    }


}

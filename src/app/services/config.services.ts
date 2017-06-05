import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';

@Injectable()
export class ConfigService {
    constructor(public http: Http) {

    }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }


    /////////////////////////  get config   ///////////////////////

    getConfig(id: String): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/configs/get/' + id;
        return this.http.get(request_url)
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    //////////////////////   update config  /////////////////
    updateConfig(config: any, id: any): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/configs/update/' + id;
        let data = {
            upload_freq: config.upload_freq,
            polling_freq: config.polling_freq,
            login_everytime: config.login_everytime
        };
        return this.http.put(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => {
                return res.json();
            })
            .catch(this.handleError);
    }
}

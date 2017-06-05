import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';

@Injectable()
export class NotificationsService {
    constructor(public http: Http) {

    }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

    notificationsPush(Data: any): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/notifications/push';
        let data = {
            sender: Data.sender,
            sender_firstname: Data.sender_firstname,
            sender_lastname: Data.sender_lastname,
            sender_photo: Data.sender_photo,
            receiver: Data.receiver,
            message: Data.message,
            type: Data.type
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getNotifications(id: String, filter: String): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/notifications/' + id + '/pull/' + filter;
        return this.http.get(request_url)
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    notificationsRead(): Promise<any> {
        let request_url = CONFIG.SERVER_URL + '/notifications/read';
        let data = {
            ids: [],
            delete: false
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => {
                return res.json();
            })
            .catch(this.handleError);
    }
}

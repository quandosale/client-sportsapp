import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';
import { Data } from './data';

@Injectable()
export class DataService {
  constructor(public http: Http) {

  }
  handleError(error: any) {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  getDatas(ownerIds: String[], _datefrom: Date, _dateto: Date, _datatype: String): Promise<any> {

    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get';
    let data = {
      datefrom: _datefrom,
      dateto: _dateto,
      ownerIds: ownerIds,
      datatype: _datatype
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getData(id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get/' + id;
    return this.http.get(request_url).toPromise().then(res => { return res.json(); }).catch(this.handleError);
  }

  getStream(_id: String, _type: number, _position: number, _length: number): Promise<any> {

    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get-stream';
    // console.log('data.service:getStream:');
    let data = {
      id: _id,                         // Id of dataset that contains the stream data
      position: _position,             // seek position by percentage, (0 ~ 100)
      length: _length,
      type: _type                      // 0 : ECG, 1: ACCelerometer
    };

    return this.http.post(request_url, data)
      .toPromise()
      .then(res => {
        // console.log('dataserver', res.json());
        return res.json();
      })
      .catch(this.handleError);
  }

  getHeartRate(_id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get-hr';
    let data = {
      id: _id                         // Id of dataset that contains the stream data
    };

    return this.http.post(request_url, data)
      .toPromise()
      .then(res => {
        // console.log('dataservice', res.json());
        return res.json();
      })
      .catch(this.handleError);
  }
  getAF(_id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get-af';
    let data = {
      id: _id                         // Id of dataset that contains the stream data
    };

    return this.http.post(request_url, data)
      .toPromise()
      .then(res => {
        // console.log('dataservice', res.json());
        return res.json();
      })
      .catch(this.handleError);
  }
  getLatestData(_id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/phr/datasets/get-latest-data/' + _id;

    return this.http.get(request_url)
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }
  addData(dataSets: Data): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/phr/datasets/add';
    let data = {
      datetime: dataSets.datetime,
      type: dataSets.type,
      patientId: dataSets.patientId,
      patientName: dataSets.patientName,
      value: dataSets.value,
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        res.json();
        // console.log(res.json());
      })
      .catch(this.handleError);
  }
}

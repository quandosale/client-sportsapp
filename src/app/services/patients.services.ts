import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';
import { Patients } from './patients';

@Injectable()
export class PatientsService {

  constructor(
    public http: Http,
  ) {

  }

  handleError(error: any) {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }


  /////////////    account register   //////////
  register(patients: Patients): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/register';
    let data = {
      firstname: patients.firstname,
      lastname: patients.lastname,
      birthday: patients.birthday,
      height: patients.height,
      gender: patients.gender,
      location: patients.location,
      city: patients.city,
      photo: patients.photo,
      phone: patients.phone,
      doctor: {
        id: patients.doctor.id,
        lastname: patients.doctor.lastname,
      }
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  /////////////  get patients /////////////////

  getPatients(): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/get/';
    return this.http.get(request_url)
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  /////////////   get Patient  //////////////////
  getPatient(id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/get/' + id;
    return this.http.get(request_url)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }
  /////////////   get Patient by doctor  //////////////////
  getPatientByDoctor(id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/get-by-doctor/' + id;
    return this.http.get(request_url)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  /////////////   get networked patients  //////////////////
  getNetworkedPatients(id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/' + id + '/get-networked-patients/';
    return this.http.get(request_url)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  ///////////////  mypatient delect   //////////////

  deletePatient(id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/delete/' + id;
    return this.http.delete(request_url)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }


  /////////////////   mypatient update   /////////////////

  updatePatient(patients: Patients, id: String): Promise<any> {
    let request_url = CONFIG.SERVER_URL + '/patients/update/' + id;
    let data = {
      firstname: patients.firstname,
      lastname: patients.lastname,
      birthday: patients.birthday,
      height: patients.height,
      gender: patients.gender,
      location: patients.location,
      city: patients.city,
      photo: patients.photo,
      phone: patients.phone,
      doctor: {
        id: patients.doctor.id,
        lastname: patients.doctor.lastname,
      }
    };
    return this.http.put(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(this.handleError);
  }
}

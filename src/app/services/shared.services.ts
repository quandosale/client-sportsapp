import { Injectable } from '@angular/core';
import { Patients, User } from './index';

@Injectable()
export class SharedService {

    constructor() {
    }
    getUserID(): String {
        let userID = JSON.parse(localStorage.getItem('userID'));
        return userID;
    }

    setUserID(userID: String) {
        localStorage.setItem('userID', JSON.stringify(userID));
    }

    getFlag(): Boolean {
        let Flag = JSON.parse(localStorage.getItem('Flag'));
        return Flag;
    }

    setFlag(Flag: Boolean) {
        localStorage.setItem('Flag', JSON.stringify(Flag));
    }

    getUser(): User {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser;
    }

    setUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getSearchUsers(): User[] {
        let searchUsers = JSON.parse(localStorage.getItem('searchUsers'));
        return searchUsers;
    }

    setSearchUsers(users: User[]) {
        localStorage.setItem('searchUsers', JSON.stringify(users));
    }

    getsearchPatients(): Patients[] {
        let searchPatients = JSON.parse(localStorage.getItem('searchPatients'));
        return searchPatients;
    }

    setsearchPatients(patients: Patients[]) {
        localStorage.setItem('searchPatients', JSON.stringify(patients));
    }

    getUsers(): User[] {
        let users = JSON.parse(localStorage.getItem('users'));
        return users;
    }

    setUsers(users: User[]) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    getPatients(): Patients[] {
        let patients = JSON.parse(localStorage.getItem('patients'));
        return patients;
    }

    setPatients(patients: Patients[]) {
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    getCalendarType(): string {
        let type = JSON.parse(localStorage.getItem('calendartype'));
        return type;
    }

    setCalendarType(_type: string) {
        localStorage.setItem('calendartype', JSON.stringify(_type));
    }
    getDataType(): string {
        let type = JSON.parse(localStorage.getItem('datatype'));
        return type;
    }

    setDataType(_type: string) {
        localStorage.setItem('datatype', JSON.stringify(_type));
    }
    getDateRange(): any {
        let _datefrom = JSON.parse(localStorage.getItem('datefrom'));
        let _dateto = JSON.parse(localStorage.getItem('dateto'));
        let result: any = {
            datefrom: _datefrom,
            dateto: _dateto
        };
        return result;
    }
    setDateRange(_datefrom: Date, _dateto: Date) {
        localStorage.setItem('datefrom', JSON.stringify(_datefrom));
        localStorage.setItem('dateto', JSON.stringify(_dateto));
    }

    getSelectedPatient(): string {
        let p = JSON.parse(localStorage.getItem('selectedPatient'));
        return p;
    }

    setSelectedPatient(p: string) {
        localStorage.setItem('selectedPatient', JSON.stringify(p));
    }
    getClickDate(): Date {
        let date = JSON.parse(localStorage.getItem('clickDate'));
        return date;
    }

    setClickDate(date: Date) {
        localStorage.setItem('clickDate', JSON.stringify(date));
    }
    getSelectedMenu(): string {
        let menu = JSON.parse(localStorage.getItem('selectedMenu'));
        return menu;
    }

    setSelectedMenu(menu: string) {
        localStorage.setItem('selectedMenu', JSON.stringify(menu));
    }

}

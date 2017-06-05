export class Patients {
    firstname: String;
    lastname: String;
    birthday: Date;
    height: Number;
    gender: String;
    location: String;
    city: String;
    photo: String;
    journals: String[];
    datasets: String[];
    gateway: String[];
    doctor: {
        id: String,
        lastname: String
    };
    phone: String;
    _id: String;
    owner: String;
    constructor() {
        this.doctor = {
            id: '',
            lastname: ''
        };
    }
}

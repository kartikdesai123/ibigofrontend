export class AdminForgotPassword{
    email : string;
    message : string;
    status : boolean;

    constructor(email){
        this.email = email;
    }
}
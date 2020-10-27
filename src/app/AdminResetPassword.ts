export class AdminResetPassword{
    token : string;
    password : string;
    password_confirmation : string;
    message : string;
    status : boolean;

    constructor(token,password,password_confirmation){
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.token = token;
    }
}
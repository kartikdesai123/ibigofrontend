export class AdminChangePassword{
    oldpassword : string;
    password : string;
    password_confirmation : string;
    message : string;
    status : boolean;

    constructor(oldpassword,password,password_confirmation){
        this.oldpassword = oldpassword;
        this.password = password;
        this.password_confirmation = password_confirmation;
    }
}
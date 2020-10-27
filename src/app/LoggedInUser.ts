export class LoggedInUser{
    email : string;
    user : string;
    password : string;
    message : string;
    status : boolean;
    token : string;
    user_profile : string;
    first_name : string;
    user_type : string;
    last_name :string;
    
    constructor(email,password){
        this.email = email;
        this.password = password;
    }
}
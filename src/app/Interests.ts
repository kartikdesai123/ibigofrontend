export class Interests{
    title : string;
    description : string;
    message : string;
    status : boolean;
    token : string;
    file : string;
    interest_details : string;
    constructor(file,title,description){
        this.file = file;
        this.title = title;
        this.description = description;
    }
}
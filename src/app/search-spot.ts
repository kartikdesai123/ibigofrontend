export class SearchSpot {
    user_id : string;
    user_profile : string;
    business_name : string;
    unique_id : boolean;
    user_slug : string;
    distance : string;

    constructor(user_id,user_profile,business_name,unique_id,user_slug,distance){
        this.user_id = user_id;
        this.user_profile = user_profile;
        this.business_name  = business_name;
        this.unique_id  = unique_id;
        this.user_slug  = user_slug;
        this.distance  = distance;
    }
}

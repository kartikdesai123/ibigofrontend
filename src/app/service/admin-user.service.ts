import { Injectable } from '@angular/core';
import { Users } from '../Users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  server:string = 'https://ibigo.shadowis.nl/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'multipart/form-data',
      'Authorization': 'my-auth-token',
      'Accept': 'application/json'
      
    })
  };

  constructor(private http:HttpClient) {
    this.httpOptions.headers =
    this.httpOptions.headers.set('Authorization', JSON.parse(localStorage.getItem('user_token')));
  }
  addUsers(image,title,description):Observable<Users>
  {
    const newUsers = new Users();
    return this.http.post<Users>(this.server+'server-api/api/user/create',newUsers,this.httpOptions);
  }

  getUsers():Observable<Users[]>{
    return this.http.get<Users[]>(this.server+'server-api/api/users',this.httpOptions);
  }

  getOne(no):Observable<Users>{
    const editUsers = {
      id:no

    }
    return this.http.get<Users>(this.server+'server-api/api/user/edit/'+no,this.httpOptions);
  }

  updateUsers(no,image,title,description):Observable<Users>{
    const exstingUsers = new Users();
    return this.http.post<Users>(this.server+'server-api/api/user/update/'+no,exstingUsers,this.httpOptions);
  }
  
  deleteUsers(no):Observable<Users>{
    return this.http.delete<Users>(this.server+'server-api/api/user/delete/'+no,this.httpOptions);
  }
}

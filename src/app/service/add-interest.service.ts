import { Injectable } from '@angular/core';
import { Interests } from '../Interests';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddInterestService {
  server:string = 'https://ibigo.shadowis.nl/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'multipart/form-data',
      'Authorization': JSON.parse(localStorage.getItem('user_token')),
      'Accept': 'application/json'
      
    })
  };

  
  constructor(private http:HttpClient) {
    this.httpOptions.headers.set('Authorization', JSON.parse(localStorage.getItem('user_token')));
  }
  addInterest(image,title,description):Observable<Interests>
  {
    const newInterest = new Interests(image,title,description);
    return this.http.post<Interests>(this.server+'server-api/api/interest/create',newInterest,this.httpOptions);
  }

  getInterest():Observable<Interests[]>{
    return this.http.get<Interests[]>(this.server+'server-api/api/interest',this.httpOptions);
  }

  getOne(no):Observable<Interests>{
    const editInterest = {
      id:no,
      image : 'not-set',
      title : 'not set',
      description:'no set'

    }
    return this.http.get<Interests>(this.server+'server-api/api/interest/detail/'+no,this.httpOptions);
  }

  updateInterest(no,image,title,description):Observable<Interests>{
    const exstingInterest = new Interests(image,title,description);
    return this.http.post<Interests>(this.server+'server-api/api/interest/update/'+no,exstingInterest,this.httpOptions);
  }
  
  deleteInterest(no):Observable<Interests>{
    return this.http.delete<Interests>(this.server+'server-api/api/interest/delete/'+no,this.httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AgmCoreModule,MapsAPILoader } from '@agm/core';
import { environment } from 'src/environments/environment';
import { SearchSpot } from '../search-spot';
import { UserLoginService } from './user-login.service';

@Injectable({
  providedIn: 'root'
})
export class SpotSearchService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'multipart/form-data',
      'Authorization': 'my-auth-token',
      'Accept': 'application/json'
      
    })
  };
  private endPoint = environment.endpoint;
  private previewdata = new BehaviorSubject('no data');
  datapreview = this.previewdata.asObservable();
  
  constructor(private http : HttpClient,private loginService :UserLoginService) { }
  searchObject = {};
  setpreviewdata(data){
    return this.previewdata.next(data);
  }

  getpreviewddata(){
    return this.datapreview;
  }

  saveSearchObject(so:any){
    this.searchObject= so;
  }
  retrieveSearchObject(){
      return this.searchObject;
  }

  getAllSpotSuggestions(lat,long):Observable<SearchSpot[]>{
    let headers = new HttpHeaders();
    if(this.loginService.isUserLoggedIn()==true){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    }
    return this.http.post<SearchSpot[]>(this.endPoint+'spot-suggestions',{lat:lat,long:long},{headers:headers});    
  }

  getAllGroups():Observable<SearchSpot[]>{
    let headers = new HttpHeaders();
    if(this.loginService.isUserLoggedIn()==true){
      headers = headers.set('Authorization',JSON.parse(localStorage.getItem('client_token')));
    }
    return this.http.get<SearchSpot[]>(this.endPoint+'list-group',{headers:headers});    
  }

  // getDistancia(origen: any, destino: any) {
  //   return new google.maps.DistanceMatrixService().getDistanceMatrix({'origins': [origen], 'destinations': [destino],'travelMode':google.maps.TravelMode.DRIVING}, (results: any) => {
  //       console.log('resultados distancia (mts) -- ', results)
  //       // .rows[0].elements[0].distance.value
  //   });
  // }
}

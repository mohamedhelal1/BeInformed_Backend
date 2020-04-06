import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Response} from '../models/response'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  url:any;
  headers:any;
  constructor(private http:HttpClient,private authService:AuthService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.url='';
   }
  getArticles(page):Observable<Response>{
    if(this.authService.loggedIn()){
      return this.http.get<Response>(`${this.url}/articles/auth/${page}`,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.authService.loadToken()
        })
      });
    }
    else{
      return this.http.get<Response>(`${this.url}/articles/${page}`,{headers: this.headers});
    }
      
  }
  getReadlater():Observable<Response>{
      return this.http.get<Response>(`${this.url}/user/getreadlater`,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.authService.loadToken()
        })
      });      
  }
  toggleLike(id){
    return this.http.put<Response>(`${this.url}/articles/liketoggle/${id}`,{},{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.loadToken()
      })
    });
  }
  toggleReadlater(id){

    console.log(this.authService.loadToken());
    return this.http.put<Response>(`${this.url}/user/togglereadlater/${id}`,{},{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.loadToken()
      })
    });
  }
}

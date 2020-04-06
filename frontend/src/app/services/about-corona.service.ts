import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AboutCoronaService {

  constructor(private http: HttpClient) { 

  }
  getCoronaCases(){
    return this.http.get<any>('https://corona-api.com/timeline');
  }
}

import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  public alert:boolean;
  public alertmessage:String;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertsService:AlertsService
  ) { }

  ngOnInit(): void {
    this.alert=false;
  }
  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(
      (res) => {
        console.log(res.data.token);
        this.authService.storeUserData(res.data.token);
        this.router.navigate(['/']);
      }, (err) => {
        console.log(err);
        this.alertsService.setMessage(err.error.message, 'error');
        //this.AlertCtrl(err.error.message);
        this.router.navigate(['/login']);
      });    
  }

  /*AlertCtrl(alertmessage:String){
      this.alert=true;
      this.alertmessage=alertmessage;
  }
  removeAlert(){
    this.alert=true;
    this.alertmessage='';
  }
  */
}

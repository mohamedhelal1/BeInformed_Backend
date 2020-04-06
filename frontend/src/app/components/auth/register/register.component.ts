import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import { AlertsService } from 'angular-alert-module';
import {AuthService} from '../../../services/auth.service';
import { Router } from '@angular/router';
import{Response} from '../../../models/response';
import { Config }from '../../../../../Config';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  firstname : String;
  lastname : String;
  email : String;
  password : String;
  confirmPassword : String;
  auth2: any;
  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  constructor(
    private validateService: ValidateService,
    private alertsService:AlertsService,
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.googleSDK(this.loginElement);
  }
  onRegisterSubmit(){
    const user = {
      firstname : this.firstname,
      lastname : this.lastname, 
      email : this.email, 
      password : this.password,
      confirmPassword : this.confirmPassword
    }
    if(!this.validateService.validateRegister(user)){
      this.alertsService.setMessage('Please fill in all fields', 'error');
      return false;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.alertsService.setMessage('Please fuse valid email', 'error');
      return false;
    }
    this.authService.registerUser(user).subscribe(
      (res: Response) => {
        console.log(res);
        this.router.navigate(['/login']);
      }, (err) => {
        console.log(err);
        this.alertsService.setMessage(err.error.message, 'error');
        this.router.navigate(['/register']);
      });
  }
  googleSDK(loginElement) {
  
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: Config.GoogleClient,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton(loginElement);
      });
    }
  
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = Config.GoogleAPI;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  
}
  prepareLoginButton(loginElement) {
 
    this.auth2.attachClickHandler(loginElement.nativeElement, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
        this.authService.registerGoogle(googleUser.getAuthResponse().id_token).subscribe(
          (res) => {
            console.log(res);
            this.authService.storeUserData(res.data.token);
            this.router.navigate(['/']);
          }, (err) => {
            console.log(err);
            this.router.navigate(['/login']);
          });  


      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });

  }
}
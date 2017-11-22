import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import {Router} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    name: String;
    username: String;
    email: String;
    password: String;
  constructor(private validateServie: ValidateService, 
    private flashMessage:FlashMessagesService, 
    private authService:AuthService,
    private router: Router) { }

  ngOnInit() {
  }
onRegisterSubmit()
{
  const user = {
    name: this.name,
    email: this.email,
    username: this.username,
    password: this.password
  }

  //Require Fields

  if(!this.validateServie.validateRegister(user)){
    this.flashMessage.show('Please fill the fields', {cssClass: 'alert-danger', timeout:3000});
    return false;
  }
  if(!this.validateServie.validateEmail(user.email)){
    this.flashMessage.show('Please fill valid email id', {cssClass: 'alert-danger', timeout:3000});
    return false;
  }

  this.authService.registerUser(user).subscribe(data => {
    if(data.success){
      this.flashMessage.show('You are now registerd and can login now', {cssClass: 'alert-success', timeout:3000});
      this.router.navigate(['/login']);
    }
    else{
      this.flashMessage.show('Something Went Wrong', {cssClass: 'alert-danger', timeout:3000});
      this.router.navigate(['/register']);
    }
  });

}
}

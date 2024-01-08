import { Component, OnInit } from '@angular/core';
import {Profil} from '../../shared/profil';
import {AuthService} from '../../helpers/auth.service';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  userLogin: Profil = new Profil();
  logedUser: any = new Profil();

  constructor(private auth: AuthService, private myRoute: Router, public restApi: ApiService){
  }

  ngOnInit(): void {

  }

  login() {
    if ( this.userLogin.login !== null ) {
      this.userExist( this.userLogin.login, this.userLogin.haslo );
    }
  }

  userExist( login: string, haslo: string ) {
    this.restApi.getProfilLogin( login, haslo ).subscribe((data: {}) => {
      this.logedUser = data;
      if ( this.logedUser.id > 0 ) {
        localStorage.setItem('LoggedInUser', JSON.stringify(this.logedUser));
        this.auth.sendToken(this.logedUser.login);
        this.myRoute.navigate(['']);
        window.location.reload();
      }
    });
  }
}

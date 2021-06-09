import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {
  public login = '';

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.getLogin().then(login => {
      this.login = login.email;
    });
  }

  ngOnInit() {}

  logout() {
    this.authenticationService.logout();
  }
}

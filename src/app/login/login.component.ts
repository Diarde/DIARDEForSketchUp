import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ConfigService } from '../services/config.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loading = false;
    submitted = false;
    returnUrl = '/';
    isWrong = false;
    errorMessage = '';

    email: string;
    password: string;
    server: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService: ConfigService
    ) { }

    ngOnInit() {
        this.configService.baseURL = ' ';

        this.server = this.configService.baseURL;
        this.email = this.configService.email;
        this.password = this.configService.password;
    }

    onSubmit() {
        this.submitted = true;

        this.configService.baseURL = this.server;
        this.configService.email = this.email;
        this.configService.password = this.password;

        this.loading = true;
        this.authenticationService.login(this.email, this.password)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.authentication === 'success') {
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.errorMessage = data.error;
                        this.isWrong = true;
                        this.loading = false;
                    }
                },
                error => {
                    this.isWrong = true;
                    this.loading = false;
                });
    }

}

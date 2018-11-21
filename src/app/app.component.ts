import { AuthService } from './utilities/services/auth.service';
import { Component, OnInit, OnChanges, AfterContentInit, SimpleChanges } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, AfterContentInit {
    // title = 'app works!';
    showAppVersionOnTitle = environment.showAppVersionOnTitle;
    loggedInAs: string;

    constructor(private auth: AuthService) { 
    }
    
    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        debugger;
    }

    ngAfterContentInit() {
        debugger;
    }

    getUser() {
        return this.auth.currentUserEmail;
    }

    authenticated() {
        return this.auth.authenticated;
    }

    logout() {
        this.auth.signOut();
    }
}




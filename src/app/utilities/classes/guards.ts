import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { FixturesLatestComponent } from '../../fixtures-latest/fixtures-latest.component';


export class AlwaysAuthGuard implements CanActivate {
    canActivate() {
        // console.log("AlwaysAuthGuard");
        return true;
    }
}

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
    constructor(private dataService: DataService,
        private userService: UserService) {
    };

    canActivate() {
        // console.log("OnlyLoggedInUsers");
        if (this.userService.isLoggedIn()) {
            return true;
        } else {
            this.dataService.confirmationMessage("You don't have permission to view the Administration section");
            // window.alert("You don't have permission to view this page");
            return false;
        }
    }
}


export class AlwaysAuthChildrenGuard implements CanActivateChild {
    canActivateChild() {
        // console.log("AlwaysAuthChildrenGuard");
        return true;
    }
}

export class CanLeaveLatestFixtures implements CanDeactivate<FixturesLatestComponent> {

    canDeactivate(component: FixturesLatestComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        console.log(route.params);
        console.log(state.url);
        // return component.canDeactivate() || window.confirm("Are you sure?");
        return component.canDeactivate() ? true : window.confirm("Are you sure you want to abandon these in-play fixtures ?");
    }
}
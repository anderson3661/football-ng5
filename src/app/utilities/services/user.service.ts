import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

    constructor() { }

    public isLoggedIn(): boolean {
        return true;
    }

}

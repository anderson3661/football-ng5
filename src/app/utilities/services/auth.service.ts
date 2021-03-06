import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable()
export class AuthService {

    // user$: Observable<User>;

    // constructor(private afAuth: AngularFireAuth,
    //     private afs: AngularFirestore,
    //     private router: Router) {

    //     // Get Auth data, then get firestore user document || null
    //     this.user$ = this.afAuth.authState
    //         .switchMap(user => {
    //             if (user) {
    //                 return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //             } else {
    //                 return Observable.of(null);
    //             }
    //         })

    // }

    // googleLogin() {
    //     const provider = new firebase.auth.GoogleAuthProvider()
    //     return this.oAuthLogin(provider);
    // }

    // private oAuthLogin(provider) {
    //     return this.afAuth.auth.signInWithPopup(provider)
    //         .then((credential) => {
    //             this.updateUserData(credential.user);
    //         });
    // }

    // signOut() {
    //     this.afAuth.auth.signOut();
    // }

    authState: any = null;
    loginError: any = null;

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router) {

        this.afAuth.authState.subscribe((auth) => {
            this.authState = auth;
        });
    }

    // Return true if user is logged in
    get authenticated(): boolean {
        return this.authState != null;
    }
    
    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState : null;
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState
    }

    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : '';
    }

    // Returns current user email
    get currentUserEmail(): string {
        return this.authenticated ? this.authState.email : '';
    }

    // Anonymous User
    get currentUserAnonymous(): boolean {
        return this.authenticated ? this.authState.isAnonymous : false
    }

    // Returns current user display name or Guest
    get currentUserDisplayName(): string {
        if (!this.authState) { return 'Guest' }
        else if (this.currentUserAnonymous) { return 'Anonymous' }
        else { return this.authState['displayName'] || 'User without a Name' }
    }

    //// Social Auth ////
    // googleLogin() {
    //     const provider = new firebase.auth.GoogleAuthProvider()
    //     return this.socialSignIn(provider);
    // }

    // githubLogin() {
    //     const provider = new firebase.auth.GithubAuthProvider()
    //     return this.socialSignIn(provider);
    // }

    // facebookLogin() {
    //     const provider = new firebase.auth.FacebookAuthProvider()
    //     return this.socialSignIn(provider);
    // }

    // twitterLogin() {
    //     const provider = new firebase.auth.TwitterAuthProvider()
    //     return this.socialSignIn(provider);
    // }

    private socialSignIn(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.authState = credential.user
                this.updateUserData()
            })
            .catch(error => console.log(error))
    }

    //// Anonymous Auth ////
    anonymousLogin() {
        return this.afAuth.auth.signInAnonymously()
            .then((user) => {
                this.authState = user
                this.updateUserData()
            })
            .catch(error => console.log(error));
    }

    //// Email/Password Auth ////
    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.authState = user;
                this.updateUserData();
            })
            .catch(error => console.log(error));
    }

    // emailSignUp2(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    //     return this.afAuth.auth.createUser(credentials)
    //         .then(() => console.log("success"))
    //         .catch(error => console.log(error));
    // }

    emailLogin(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                // debugger;
                this.authState = user;
                this.updateUserData();
                this.router.navigate(['/administration']);
            })
            .catch(error => {
                console.log(error)
                this.loginError = error
            });
    }

    // emailLogin2(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    //     return this.afAuth.auth.login(credentials,
    //         {
    //             provider: AuthProviders.Password,
    //             method: AuthMethods.Password
    //         })
    //         .then(() => console.log("success"))
    //         .catch(error => console.log(error));
    // }

    // Sends email allowing user to reset password
    // resetPassword(email: string) {
    //     var auth = firebase.auth();

    //     return auth.sendPasswordResetEmail(email)
    //         .then(() => console.log("email sent"))
    //         .catch((error) => console.log(error))
    // }

    //// Sign Out ////
    signOut(): void {
        debugger;
        this.afAuth.auth.signOut();
        this.router.navigate(['/'])
    }

    //// Helpers ////
    private updateUserData(): void {
        // Writes user name and email to realtime db
        // useful if your app displays information about users or for admin features
        let path = `users/${this.currentUserId}`; // Endpoint on firebase
        let data = {
            email: this.authState.email,
            name: this.authState.displayName,
            roles: {
                subscriber: true
            }
        }

        this.db.object(path).update(data)
            .catch(error => console.log(error));
    }

    // private updateUserData(user) {
    //     // Sets user data to firestore on login
    //     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    //     const data: User = {
    //         uid: user.uid,
    //         email: user.email,
    //         roles: {
    //             subscriber: true
    //         }
    //     }
    //     return userRef.set(data, { merge: true });
    // }

    ///// Role-based Authorization //////

    canRead(user: User): boolean {
        const allowed = ['admin', 'subscriber', 'default'];
        return this.checkAuthorization(user, allowed);
    }

    canEdit(user: User): boolean {
        const allowed = ['admin', 'subscriber'];
        return this.checkAuthorization(user, allowed);
    }

    canDelete(user: User): boolean {
        const allowed = ['admin'];
        return this.checkAuthorization(user, allowed);
    }

    // determines if user has matching role
    private checkAuthorization(user: User, allowedRoles: string[]): boolean {
        if (!user) return false;
        for (const role of allowedRoles) {
            if (user.roles[role]) {
                return true;
            }
        }
        return false;
    }

}

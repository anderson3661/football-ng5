import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../../environments/environment';


@NgModule({
    imports: [
        // CommonModule
        // AngularFireAuthModule,
        // AngularFireModule.initializeApp(environment.firebase, 'my-app-name')    //my-app-name is an optional custom FirebaseApp name
        AngularFireModule.initializeApp(environment.firebase)
    ],
    declarations: [],
    providers: [AuthService]
})
export class CoreModule { }

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

// import {
//     MatTooltipModule,
//     MatSnackBarModule,
//     MatMenuModule,
//     MatSidenavModule,
//     MatToolbarModule,
//     MatTableModule,
//     MatProgressSpinnerModule
// } from '@angular/material';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatIconModule,
        MatRadioModule,
        // MatTooltipModule,
        // MatSnackBarModule,
        // MatMenuModule,
        // MatSidenavModule,
        // MatToolbarModule,
        // MatTableModule,
        // MatProgressSpinnerModule,
    ],
    exports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatIconModule,
        MatRadioModule,
        // MatTooltipModule,
        // MatSnackBarModule,
        // MatMenuModule,
        // MatSidenavModule,
        // MatToolbarModule,
        // MatTableModule,
        // MatProgressSpinnerModule,
    ]
})
export class AppMaterialModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppMaterialModule } from './app.material.module';

import { DataService } from './utilities/services/data.service';
import { UserService } from './utilities/services/user.service';
import { AdministrationComponent } from './administration/administration.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { FixturesLatestComponent } from './fixtures-latest/fixtures-latest.component';
import { FixtureRowComponent } from './fixture-row/fixture-row.component';
import { TablesComponent } from './tables/tables.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { ContactComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { DialogComponent } from './dialog/dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// import { CoreModule } from './utilities/modules/core.module';
import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { AuthService } from './utilities/services/auth.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

// import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AdministrationComponent,
    FixturesComponent,
    FixturesLatestComponent,
    FixtureRowComponent,
    TablesComponent,
    TeamStatsComponent,
    HelpComponent,
    ContactComponent,
    AboutComponent,
    LoginComponent,
    PageNotFoundComponent,
    DialogComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppMaterialModule,
    // ChartsModule,
    // CoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [ DataService, UserService, AuthService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

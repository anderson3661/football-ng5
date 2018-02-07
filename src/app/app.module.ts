import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';

import { DataService } from './zzz-other/services/data.service';
import { AdministrationComponent } from './administration/administration.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { FixturesLatestComponent } from './fixtures-latest/fixtures-latest.component';
import { TablesComponent } from './tables/tables.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { DialogComponent } from './dialog/dialog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
// import { ChartsModule } from 'ng2-charts';
// import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    AdministrationComponent,
    FixturesComponent,
    FixturesLatestComponent,
    TablesComponent,
    TeamStatsComponent,
    PageNotFoundComponent,
    DialogComponent,
    // ChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    // ChartsModule,
    RouterModule.forRoot([
      { path: '', component: AdministrationComponent },
      { path: 'administration', component: AdministrationComponent },
      { path: 'fixtures', component: FixturesComponent },
      { path: 'fixtures/:displayResults', component: FixturesComponent },
      { path: 'fixtures-latest', component: FixturesLatestComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'teamstats', component: TeamStatsComponent },
      { path: 'teamstats/:teamName', component: TeamStatsComponent },
      { path: 'tables/:displayFullTable', component: TablesComponent },
      { path: '**', component: PageNotFoundComponent }
    ])    
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

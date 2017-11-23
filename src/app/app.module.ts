import { DataService } from './zzz-other/services/data.service';
import { FixturesComponent } from './fixtures/fixtures.component';
import { FixturesLatestComponent } from './fixtures-latest/fixtures-latest.component';
import { TablesComponent } from './tables/tables.component';
import { AdministrationComponent } from './administration/administration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    AdministrationComponent,
    FixturesComponent,
    FixturesLatestComponent,
    TablesComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatCardModule,
    RouterModule.forRoot([
      { path: '', component: AdministrationComponent },
      { path: 'administration', component: AdministrationComponent },
      { path: 'fixtures', component: FixturesComponent },
      { path: 'fixtures/:displayResults', component: FixturesComponent },
      { path: 'fixtures-latest', component: FixturesLatestComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'tables/:displayFullTable', component: TablesComponent },
      { path: '**', component: PageNotFoundComponent }
    ])    
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

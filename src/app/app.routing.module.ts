import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { FixturesComponent } from './fixtures/fixtures.component';
import { FixturesLatestComponent } from './fixtures-latest/fixtures-latest.component';
import { TablesComponent } from './tables/tables.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { AdministrationComponent } from './administration/administration.component';
import { HelpComponent } from './help/help.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { OnlyLoggedInUsersGuard, AlwaysAuthGuard, AlwaysAuthChildrenGuard, CanLeaveLatestFixtures } from './utilities/classes/guards';

const routes: Routes = [
    { pathMatch: 'full', path: '', redirectTo: 'administration' },
    { path: 'fixtures', component: FixturesComponent },
    { path: 'fixtures/:displayResults', component: FixturesComponent },
    { path: 'fixtures-latest', component: FixturesLatestComponent, canDeactivate: [CanLeaveLatestFixtures] },
    { path: 'tables', component: TablesComponent },
    { path: 'tables/:displayFullTable', component: TablesComponent },
    // { path: 'teamstats', component: TeamStatsComponent },
    { path: 'teamstats/:teamName', component: TeamStatsComponent },
    { path: 'administration', component: AdministrationComponent, canActivate: [OnlyLoggedInUsersGuard, AlwaysAuthGuard], canActivateChild: [AlwaysAuthChildrenGuard] },
    { path: 'help', component: HelpComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'signin',
        children: [
            { path: 'email', component: LoginComponent },
            { path: 'gmail', component: LoginComponent },
            { path: 'register', component: LoginComponent }
        ]},
    { path: '**', component: PageNotFoundComponent }];

      
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: true })],
    exports: [RouterModule],
    providers: [OnlyLoggedInUsersGuard, AlwaysAuthGuard, AlwaysAuthChildrenGuard, CanLeaveLatestFixtures]
})

export class AppRoutingModule { }
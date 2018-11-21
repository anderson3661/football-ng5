import { AuthService } from './../utilities/services/auth.service';
import { DataService } from './../utilities/services/data.service';
import { Team } from '../utilities/classes/team';
import { SetOfFixtures } from '../utilities/classes/set-of-fixtures';
import { SetOfFixturesModel, FixturesDatesModel } from '../utilities/interfaces/interfaces';
import * as helpers from '../utilities/helper-functions/helpers';
import { Component, OnInit } from '@angular/core';

const NUMBER_OF_ATTEMPTS_TO_GET_SET_OF_TEAMS = 100000;


@Component({
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

    public appDataTeams;
    public appDataMiscInfo;
    private teams: any[] = [];                      // This references the class team in classes/team.ts and not the TeamModel in interfaces
    private setOfFixtures: SetOfFixturesModel;

    constructor(public dataService: DataService,
                private auth: AuthService) { }

    ngOnInit() {
        this.appDataMiscInfo = this.dataService.appData.miscInfo;
        this.appDataTeams = this.dataService.appData.teamsForSeason;
    }

    authenticated() {
        return this.auth.authenticated;
    }

    createFixturesForSeason(): void {
        if (this.dataService.appData.miscInfo.haveSeasonsFixturesBeenCreated) {
            this.dataService.confirmResetSeason("Are you sure you want to reset the season ?", false, this.createFixtures.bind(this));
        } else {
            this.createFixtures();
        }
    }

    createFixtures(): void {
        let dateOfSetOfFixtures: string = "";
        let i: number = 0;
        let retryCounter: number = 0;
        let setOfFixturesCounter: number = 0;
        let numberOfFixturesForSeason: number = 0;
        let datesOfFixturesForSeason: FixturesDatesModel = [];
        let fixturesForSeason: any[] = [];
        let appDataMiscInfo;

        dateOfSetOfFixtures = this.dataService.appData.miscInfo.seasonStartDate;
        numberOfFixturesForSeason = this.dataService.appData.miscInfo.numberOfFixturesForSeason;
        
        // if (this.dataService.resetSeason()) {        //Reset the season indicators

        // Populate the datesOfFixturesForSeason array, an element for every set of fixtures in the season
        for (i = 0; i < numberOfFixturesForSeason; i++) {
            datesOfFixturesForSeason.push({ 'date': dateOfSetOfFixtures = this.getFixturesDate(dateOfSetOfFixtures), 'numberOfFixtures': numberOfFixturesForSeason.toString() });
        }

        // Populate the teams array, an element for each team, containing properties and numerous methods
        for (i = 0; i < this.dataService.appData.teamsForSeason.length; i++) {
            this.teams.push(new Team(this.dataService, i));
        }

        for (setOfFixturesCounter = 0; setOfFixturesCounter < numberOfFixturesForSeason; setOfFixturesCounter++) {

            console.log('');
            console.log('Starting fixture set ' + (setOfFixturesCounter + 1));

            if (setOfFixturesCounter === 32) {
                console.log('');
            }

            retryCounter = 0;

            this.setOfFixtures = undefined;

            while (this.setOfFixtures === undefined || this.setOfFixtures.fixtures === undefined) {

                this.setOfFixtures = {
                    fixtures: (new SetOfFixtures(this.dataService, this.teams)).createSetOfFixtures(),
                    dateOfSetOfFixtures: datesOfFixturesForSeason[setOfFixturesCounter].date
                };

                retryCounter++;
                if (retryCounter > NUMBER_OF_ATTEMPTS_TO_GET_SET_OF_TEAMS) {
                    console.log('Cannot get teams for set of fixtures');
                    alert('Cannot create fixtures for season ... ' + fixturesForSeason.length + ' sets of fixtures created');
                    return;
                }
            }

            this.updateCheckArrays();

            fixturesForSeason.push(this.setOfFixtures);        //Update the array - this is used to output the matches to the web page
        }

        //Update the All Fixtures array in the data service and save
        this.dataService.appData.miscInfo.haveSeasonsFixturesBeenCreated = true;
        this.dataService.appData.setsOfFixtures = fixturesForSeason;
        this.dataService.saveAppData();

        console.log('');
        console.log('Finished');

        this.dataService.confirmationMessage("Fixtures created for season");
    }

    private updateCheckArrays(): void {
        //We now have the 20 teams and therefore 10 matches.
        //Now update the arrays used to check numbers of home/away games and also the dates of these games
        let homeTeam: string = "";
        let awayTeam: string = "";
        let homeTeamIndex: number;
        let awayTeamIndex: number;

        homeTeamIndex = 0;
        awayTeamIndex = 0;

        this.setOfFixtures.fixtures.forEach(fixture => {
            homeTeam = fixture.homeTeam;
            awayTeam = fixture.awayTeam;

            homeTeamIndex = helpers.getPositionInArrayOfObjects(this.teams, "teamName", homeTeam);
            awayTeamIndex = helpers.getPositionInArrayOfObjects(this.teams, "teamName", awayTeam);

            this.teams[homeTeamIndex].updateCheckArraysForTeam(this.teams[awayTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures, "H");
            this.teams[awayTeamIndex].updateCheckArraysForTeam(this.teams[homeTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures, "A");
            this.teams[homeTeamIndex].updateCheckArraysForHomeTeam(this.teams[awayTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures);
            this.teams[awayTeamIndex].updateCheckArraysForAwayTeam(this.teams[homeTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures);

            console.log(homeTeam + ' v ' + awayTeam);
        });
    }

    private getFixturesDate(date: string): string {
        let fixturesDate: Date;
        let fixturesDateNew: Date;

        fixturesDate = new Date(date);
        fixturesDateNew = new Date(fixturesDate);
        fixturesDateNew.setDate(fixturesDateNew.getDate() + 7);
        return fixturesDateNew.toDateString();
    }

}

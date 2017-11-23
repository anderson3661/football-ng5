import { DataService } from './../zzz-other/services/data.service';
import { Team } from '../zzz-other/classes/team';
import { SetOfFixtures } from '../zzz-other/classes/set-of-fixtures';
import { SetOfFixturesModel, FixturesDatesModel } from '../zzz-other/interfaces/interfaces';
import * as helpers from '../zzz-other/helper-functions/helpers';

import { Component, OnInit } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';

const NUMBER_OF_ATTEMPTS_TO_GET_SET_OF_TEAMS = 100000;


@Component({
    selector:   'app-administration',
    templateUrl:'./administration.component.html',
    styleUrls:  ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

    public appDataTeams;
    public appDataMiscInfo;
    private teams: any[] = [];                      // This references the class team in classes/team.ts and not the TeamModel in interfaces
    private setOfFixtures: SetOfFixturesModel;

    constructor(public dataService: DataService) { }

    ngOnInit() {
        this.appDataMiscInfo = this.dataService.appData.miscInfo;
        this.appDataTeams = this.dataService.appData.teamsForSeason;
    }

    createFixturesForSeason(): void {
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

        //Reset the season indicators
        if (this.dataService.resetSeason()) {
            debugger;
            
            // Populate the datesOfFixturesForSeason array, an element for every set of fixtures in the season
            for (i = 0; i < numberOfFixturesForSeason; i++) {
                datesOfFixturesForSeason.push({ 'date': dateOfSetOfFixtures = this.getFixturesDate(dateOfSetOfFixtures), 'numberOfMatches': numberOfFixturesForSeason.toString() });
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
            this.dataService.appData.allFixtures = fixturesForSeason;
            this.dataService.saveAppData();

            console.log('');
            console.log('Finished');

            alert('Fixtures created for season');
        }
    }

    private updateCheckArrays(): void {
        //We now have the 20 teams and therefore 10 matches.
        //Now update the arrays used to check numbers of home/away games and also the dates of these games
        let homeTeam: string = "";
        let awayTeam: string = "";
        let homeTeamIndex: number = 0;
        let awayTeamIndex: number = 0;
        let nFixture: number = 0;

        for (nFixture = 0; nFixture < this.setOfFixtures.fixtures.length; nFixture++) {

            homeTeam = this.setOfFixtures.fixtures[nFixture].homeTeam;
            awayTeam = this.setOfFixtures.fixtures[nFixture].awayTeam;

            homeTeamIndex = helpers.getPositionInArrayOfObjects(this.teams, "teamName", homeTeam);
            awayTeamIndex = helpers.getPositionInArrayOfObjects(this.teams, "teamName", awayTeam);

            this.teams[homeTeamIndex].updateCheckArraysForTeam(this.teams[awayTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures, "H");
            this.teams[awayTeamIndex].updateCheckArraysForTeam(this.teams[homeTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures, "A");
            this.teams[homeTeamIndex].updateCheckArraysForHomeTeam(this.teams[awayTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures);
            this.teams[awayTeamIndex].updateCheckArraysForAwayTeam(this.teams[homeTeamIndex].teamName, this.setOfFixtures.dateOfSetOfFixtures);

            console.log(homeTeam + ' v ' + awayTeam);
        }
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
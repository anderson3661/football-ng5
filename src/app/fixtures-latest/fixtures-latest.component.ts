import { DataService } from './../zzz-other/services/data.service';
import { TeamsModel, AllFixturesModel, SetOfFixturesModel, TableModel, TablesModel, SetOfFixturesControllerModel, AppDataModel } from './../zzz-other/interfaces/interfaces';
import { SetOfFixtures } from './../zzz-other/classes/set-of-fixtures';
import * as helpers from '../zzz-other/helper-functions/helpers';
import { Component, OnInit } from '@angular/core';

const SHOW_FORM_MATCHES = 10;
const HOME_TEAM = 0;
const EXTRA_MINUTES_FIRST_HALF = 5;
const EXTRA_MINUTES_SECOND_HALF = 9;


@Component({
    selector: 'app-fixtures-latest',
    templateUrl: './fixtures-latest.component.html',
    styleUrls: [
        '../../../node_modules/font-awesome/css/font-awesome.min.css',
        './../zzz-other/css/fixtures.css',
        './../zzz-other/css/tables.css',        
        './fixtures-latest.component.css',
    ]
})
export class FixturesLatestComponent implements OnInit {

    private teams: TeamsModel;
    private fixturesForSeason: AllFixturesModel;
    public tableBeforeFixtures: TablesModel;
    public tableInPlay: TablesModel;
    public latestFixtures: SetOfFixturesModel;
    private dateOfLastSetOfFixtures: string;

    public setOfFixturesController: SetOfFixturesControllerModel;

    private progressMatches;

    private tableTypeInPlay: boolean;                         // Required by the HTML - also used by fixtures-latest.component (i.e. in the html call)
    


    constructor(private dataService: DataService) { }

    ngOnInit() {
        let goalFactorsSource: string;

        this.teams = this.dataService.appData.teamsForSeason;
        this.fixturesForSeason = this.dataService.appData.allFixtures;
        this.tableBeforeFixtures = this.dataService.appData.latestTable;
        this.dateOfLastSetOfFixtures = this.dataService.appData.miscInfo.dateOfLastSetOfFixtures;

        if (this.dataService.haveSeasonsFixturesBeenCreated()) {

            this.setOfFixturesController = <SetOfFixturesControllerModel>{};

            this.setOfFixturesController.fixturesInPlay = false;
            this.setOfFixturesController.isFirstHalf = true;
            this.setOfFixturesController.startFixturesButtonText = "Start Fixtures";
            this.setOfFixturesController.versusBetweenTeams = "v";

            this.setOfFixturesController.maxInjuryTime1stHalf = 0;
            this.setOfFixturesController.maxInjuryTime2ndHalf = 0;
            this.setOfFixturesController.minutesInfo = "";

            this.setOfFixturesController.matchUpdateInterval = this.dataService.appData.miscInfo.matchUpdateInterval;
            this.setOfFixturesController.factorBaseForRandomMultiplier = this.dataService.appData.miscInfo.factorBaseForRandomMultiplier;
            this.setOfFixturesController.factorAwayTeam = this.dataService.appData.miscInfo.factorAwayTeam;
            this.setOfFixturesController.factorIsNotATopTeam = this.dataService.appData.miscInfo.factorIsNotATopTeam;
            this.setOfFixturesController.factorIsItAGoal = this.dataService.appData.miscInfo.factorIsItAGoal;

            if (this.dataService.appData.latestTable[0].played > 0) {
                this.setOfFixturesController.teamIn1stPlaceInTable = this.dataService.appData.latestTable[0].teamName;
                this.setOfFixturesController.teamIn2ndPlaceInTable = this.dataService.appData.latestTable[1].teamName;
                this.setOfFixturesController.teamIn3rdPlaceInTable = this.dataService.appData.latestTable[2].teamName;
            }

            // Convert likelihood of a goal during a certain period of a match from a string to an array
            goalFactorsSource = this.dataService.appData.miscInfo.factorLikelihoodOfAGoalDuringASetPeriod;
            goalFactorsSource = goalFactorsSource.replace(/'/g, '"');         //Need to do this otherwise reading the value from local storage errors
            this.setOfFixturesController.factorLikelihoodOfAGoalDuringASetPeriod = JSON.parse("[" + goalFactorsSource + "]");

            this.latestFixtures = this.getNextSetOfFixtures();

            if (this.latestFixtures != undefined) {
                this.setOfFixturesController.dateOfThisSetOfFixtures = this.latestFixtures.dateOfSetOfFixtures;
                this.setScoresAndGoals("");
                this.setupInPlayTable();
            }

        }
    }

    private getNextSetOfFixtures(): SetOfFixturesModel {
        let i: number = 0;

        if (this.dateOfLastSetOfFixtures === "" || this.dateOfLastSetOfFixtures === undefined || this.dateOfLastSetOfFixtures === null) {
            return this.fixturesForSeason[0];
        } else {
            for (i = 0; i < this.fixturesForSeason.length; i++) {
                if (this.fixturesForSeason[i].dateOfSetOfFixtures === this.dateOfLastSetOfFixtures) {
                    return this.fixturesForSeason[i + 1];
                }
            }
        }
    }

    startSetOfFixtures(): void {
        let i: number;
        let injuryTimeHalf1: number;
        let injuryTimeHalf2: number;

        this.setOfFixturesController.fixturesInPlay = true;
        this.setOfFixturesController.versusBetweenTeams = "";
        this.setOfFixturesController.statutoryMinutes = (this.setOfFixturesController.isFirstHalf) ? 45 : 90;
        this.setOfFixturesController.minutesPlayed = (this.setOfFixturesController.isFirstHalf) ? 0 : 45;

        //Set the number of injury time minutes for each fixture
        for (i = 0; i < this.latestFixtures.fixtures.length; i++) {

            if (this.setOfFixturesController.isFirstHalf) this.setScoresAndGoals(0);

            injuryTimeHalf1 = Math.floor(Math.random() * EXTRA_MINUTES_FIRST_HALF + 1);
            this.latestFixtures.fixtures[i].injuryTime1stHalf = injuryTimeHalf1;
            this.setOfFixturesController.maxInjuryTime1stHalf = Math.max(injuryTimeHalf1, this.setOfFixturesController.maxInjuryTime1stHalf);     //Determine the match with the most injury time, to stop timer

            injuryTimeHalf2 = Math.floor(Math.random() * EXTRA_MINUTES_SECOND_HALF + 1);
            this.latestFixtures.fixtures[i].injuryTime2ndHalf = injuryTimeHalf2;
            this.setOfFixturesController.maxInjuryTime2ndHalf = Math.max(injuryTimeHalf2, this.setOfFixturesController.maxInjuryTime2ndHalf);     //Determine the match with the most injury time, to stop timer

            this.latestFixtures.fixtures[i].maxNumberOfMinutes = this.setOfFixturesController.statutoryMinutes + ((this.setOfFixturesController.isFirstHalf) ? injuryTimeHalf1 : injuryTimeHalf2);
        }

        this.setOfFixturesController.maxNumberOfMinutes = (this.setOfFixturesController.isFirstHalf) ? this.setOfFixturesController.statutoryMinutes + this.setOfFixturesController.maxInjuryTime1stHalf : this.setOfFixturesController.statutoryMinutes + this.setOfFixturesController.maxInjuryTime2ndHalf;

        this.setOfFixturesController.startFixturesButtonEnabled = false;           //Disable the Start Fixtures button

        // Name of the function and Update interval are both required
        this.progressMatches = setInterval(this.updateScores, this.setOfFixturesController.matchUpdateInterval, this)
    }

    private updateScores(self: this): void {
        // Cannot use this as it is an asynchronous function.  Make sure self is set to type this so that intellisense works
        let updateTable: boolean;
        let minutesinMatchFactor: number = 0;
        let fixtureCounter: number = 0;
        let goalFactors: any[];

        goalFactors = self.setOfFixturesController.factorLikelihoodOfAGoalDuringASetPeriod;

        for (let i = 0; i < goalFactors[0].length; i++) {
            if (self.setOfFixturesController.minutesPlayed <= goalFactors[0][i].minutes) {
                minutesinMatchFactor = self.setOfFixturesController.factorBaseForRandomMultiplier * goalFactors[0][i].factor;
                break;
            }
        }

        updateTable = false;

        self.setOfFixturesController.minutesPlayed++;

        for (fixtureCounter = 0; fixtureCounter < self.latestFixtures.fixtures.length; fixtureCounter++) {

            if (self.setOfFixturesController.minutesPlayed <= self.latestFixtures.fixtures[fixtureCounter].maxNumberOfMinutes) {
                if (self.hasTeamScored("home", self, fixtureCounter, minutesinMatchFactor) && !updateTable) updateTable = true;
                if (self.hasTeamScored("away", self, fixtureCounter, minutesinMatchFactor) && !updateTable) updateTable = true;
            }
        }

        if (updateTable) self.updateInPlayTable();

        //Check for end of fixtures
        if (self.setOfFixturesController.minutesPlayed > self.setOfFixturesController.maxNumberOfMinutes) {
            clearInterval(self.progressMatches);     //Clear the timer
            self.setOfFixturesController.fixturesInPlay = false;
            if (self.setOfFixturesController.isFirstHalf) {
                self.setOfFixturesController.minutesInfo = "Half-Time";
                self.setOfFixturesController.isFirstHalf = false;
                self.setOfFixturesController.startFixturesButtonEnabled = true;           //Enable the Start Fixtures button
                self.setOfFixturesController.startFixturesButtonText = "Start Second Half";
            } else {
                debugger;
                self.setOfFixturesController.minutesInfo = "Full-Time";
                self.dataService.appData.miscInfo.dateOfLastSetOfFixtures = self.setOfFixturesController.dateOfThisSetOfFixtures;
                self.dataService.appData.latestTable = self.tableInPlay;
                self.dataService.saveAppData();
            }
        } else {
            self.setOfFixturesController.minutesInfo = self.setOfFixturesController.minutesPlayed + " mins";
        }

    }

    private hasTeamScored(whichTeam: string, self: this, fixtureCounter: number, minutesinMatchFactor: number): boolean {
        let thisTeam: string;
        let awayTeamFactor: number;
        let isNotATopTeamFactor: number;
        let isItAGoalFactor: number;

        awayTeamFactor = (whichTeam === "home") ? 1 : self.setOfFixturesController.factorAwayTeam;

        thisTeam = self.latestFixtures.fixtures[fixtureCounter][whichTeam + "Team"];

        isNotATopTeamFactor = (self.teams[helpers.getPositionInArrayOfObjects(self.teams, "teamName", thisTeam)].isATopTeam) ? 1 : self.setOfFixturesController.factorIsNotATopTeam;

        isItAGoalFactor = self.setOfFixturesController.factorIsItAGoal;

        // Has a goal been scored
        if (Math.floor(Math.random() * minutesinMatchFactor * awayTeamFactor * isNotATopTeamFactor) < isItAGoalFactor) {
            self.latestFixtures.fixtures[fixtureCounter][whichTeam + "TeamsScore"] += 1;

            if (self.setOfFixturesController.minutesPlayed > self.setOfFixturesController.statutoryMinutes) {
                self.latestFixtures.fixtures[fixtureCounter][whichTeam + "TeamsGoals"] += self.setOfFixturesController.statutoryMinutes.toString() + "(+" + (self.setOfFixturesController.minutesPlayed - self.setOfFixturesController.statutoryMinutes).toString() + ")  ";
            } else {
                self.latestFixtures.fixtures[fixtureCounter][whichTeam + "TeamsGoals"] += self.setOfFixturesController.minutesPlayed + "  ";
            }
            return true;        // return true to update table and re-display
        }
        return false;
    }

    private setScoresAndGoals(scoresValue: any): void {
        let i: number;

        for (i = 0; i < this.latestFixtures.fixtures.length; i++) {
            this.latestFixtures.fixtures[i].homeTeamsScore = scoresValue;
            this.latestFixtures.fixtures[i].awayTeamsScore = scoresValue;
            this.latestFixtures.fixtures[i].homeTeamsGoals = "";
            this.latestFixtures.fixtures[i].awayTeamsGoals = "";
        }
    }

    private updateInPlayTable(): void {
        let fixtureCounter: number;
        let homeOrAwayCounter: number;
        let thisTeam: string;
        let homeTeam: string;
        let awayTeam: string;
        let homeTeamScore: number;
        let awayTeamScore: number;
        let indexBeforeFixtures: number;
        let indexInPlay: number;
        let fixture;
        let team: TableModel;
        let teamInPlay: TableModel;

        for (fixtureCounter = 0; fixtureCounter < this.latestFixtures.fixtures.length; fixtureCounter++) {

            fixture = this.latestFixtures.fixtures[fixtureCounter];
            homeTeam = fixture.homeTeam;
            awayTeam = fixture.awayTeam;
            homeTeamScore = fixture.homeTeamsScore;
            awayTeamScore = fixture.awayTeamsScore;

            for (homeOrAwayCounter = 0; homeOrAwayCounter <= 1; homeOrAwayCounter++) {

                thisTeam = (homeOrAwayCounter === HOME_TEAM) ? homeTeam : awayTeam;

                indexBeforeFixtures = helpers.getPositionInArrayOfObjects(this.dataService.appData.latestTable, "teamName", thisTeam);
                indexInPlay = helpers.getPositionInArrayOfObjects(this.tableInPlay, "teamName", thisTeam);

                team = this.dataService.appData.latestTable[indexBeforeFixtures];
                teamInPlay = this.tableInPlay[indexInPlay];

                teamInPlay.played = team.played + 1;

                teamInPlay.won = team.won;
                teamInPlay.drawn = team.drawn;
                teamInPlay.lost = team.lost;

                teamInPlay.points = team.points;

                if (homeOrAwayCounter === HOME_TEAM) {

                    teamInPlay.homeWon = team.homeWon;
                    teamInPlay.homeDrawn = team.homeDrawn;
                    teamInPlay.homeLost = team.homeLost;

                    if (homeTeamScore > awayTeamScore) {
                        teamInPlay.homeWon++;
                        teamInPlay.won++;
                        teamInPlay.points += 3;
                        teamInPlay.form[teamInPlay.form.length - 1] = "W";
                    }

                    if (homeTeamScore === awayTeamScore) {
                        teamInPlay.homeDrawn++;
                        teamInPlay.drawn++;
                        teamInPlay.points += 1;
                        teamInPlay.form[teamInPlay.form.length - 1] = "D";
                    }

                    if (homeTeamScore < awayTeamScore) {
                        teamInPlay.homeLost++;
                        teamInPlay.lost++;
                        teamInPlay.form[teamInPlay.form.length - 1] = "L";
                    }

                    teamInPlay.goalsFor = team.goalsFor + homeTeamScore;
                    teamInPlay.goalsAgainst = team.goalsAgainst + awayTeamScore;
                    teamInPlay.homeGoalsFor = team.homeGoalsFor + homeTeamScore;
                    teamInPlay.homeGoalsAgainst = team.homeGoalsAgainst + awayTeamScore;
                    teamInPlay.goalDifference = team.goalDifference + homeTeamScore - awayTeamScore;

                } else {

                    teamInPlay.awayWon = team.awayWon;
                    teamInPlay.awayDrawn = team.awayDrawn;
                    teamInPlay.awayLost = team.awayLost;

                    if (awayTeamScore > homeTeamScore) {
                        teamInPlay.awayWon++;
                        teamInPlay.won++;
                        teamInPlay.points += 3;
                        teamInPlay.form[teamInPlay.form.length - 1] = "W";
                    }

                    if (awayTeamScore === homeTeamScore) {
                        teamInPlay.awayDrawn++;
                        teamInPlay.drawn++;
                        teamInPlay.points += 1;
                        teamInPlay.form[teamInPlay.form.length - 1] = "D";
                    }

                    if (awayTeamScore < homeTeamScore) {
                        teamInPlay.awayLost++;
                        teamInPlay.lost++;
                        teamInPlay.form[teamInPlay.form.length - 1] = "L";
                    }

                    teamInPlay.goalsFor = team.goalsFor + awayTeamScore;
                    teamInPlay.goalsAgainst = team.goalsAgainst + homeTeamScore;
                    teamInPlay.awayGoalsFor = team.awayGoalsFor + awayTeamScore;
                    teamInPlay.awayGoalsAgainst = team.awayGoalsAgainst + homeTeamScore;
                    teamInPlay.goalDifference = team.goalDifference + awayTeamScore - homeTeamScore;
                }

                // Just take the last (i.e. latest) 10 games for the Form column
                if (teamInPlay.form.length > SHOW_FORM_MATCHES) {
                    teamInPlay.form = teamInPlay.form.slice(teamInPlay.form.length - SHOW_FORM_MATCHES);
                }
            }
        }

        this.tableInPlay.sort(helpers.deepSortAlpha(['points', 'goalDifference', 'goalsFor', 'teamName']));

    }

    private setupInPlayTable(): void {
        let i;

        //Deep clone the array
        this.tableInPlay = JSON.parse(JSON.stringify(this.dataService.appData.latestTable));

        //Add a new array element for Form
        for (i = 0; i < this.tableInPlay.length; i++) {
            this.tableInPlay[i].form.push("");
        }

    }

    private getPositionInArrayOfObjectsThis(array, objectProperty, obJectValue): number {

        //Call the function in the helpers file.  Needs to be done like this so that the function can be referenced in the html file with ngClass
        return helpers.getPositionInArrayOfObjects(array, objectProperty, obJectValue);
    }


}

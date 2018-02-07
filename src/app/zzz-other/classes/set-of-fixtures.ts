import { FixturesModel, TeamsModel, MiscInfoModel } from './../interfaces/interfaces';
import { DataService } from '../services/data.service';
import * as helpers from './../helper-functions/helpers';
import { Team } from './team';

const NUMBER_OF_ATTEMPTS_TO_GET_RANDOM_TEAM = 50;


export class SetOfFixtures {

    private teams: any[] = [];
    private teamsSelected: string[] = [];
    private remainingTeams: string[] = [];
    private mandatoryHomeTeams: any[] = [];
    private mandatoryAwayTeams: any[] = [];

    private appDataTeams: TeamsModel;
    private appDataMiscInfo: MiscInfoModel;
    private numberOfTeams: number;

    constructor(private dataService: DataService, teams) {
        this.appDataTeams = dataService.appData.teamsForSeason;
        this.appDataMiscInfo = dataService.appData.miscInfo;
        this.numberOfTeams = this.appDataMiscInfo.numberOfTeams;
        this.teams = teams;
    }


    createSetOfFixtures(): any[] {
        let i: number;
        let numberOfMatches: number;
        let validTeam: string;
        let setOfFixtures: FixturesModel;

        this.mandatoryHomeTeams = this.getMandatoryTeams("H").reverse();        //Get the mandatory home teams and reverse the array so that the remaining array works ok below
        this.mandatoryAwayTeams = this.getMandatoryTeams("A").reverse();        //Get the mandatory away teams and reverse the array so that the remaining array works ok below        

        setOfFixtures = [];

        while (true) {
            this.teamsSelected = [];

            for (i = 0; i < this.numberOfTeams; i++) {
                this.remainingTeams.push(this.appDataTeams[i].teamName);       //Put the team names into an array
            }

            for (i = 0; i < this.numberOfTeams; i++) {

                validTeam = this.getRandomTeam(i);

                if (validTeam === undefined) {
                    return undefined;     //If the call to get a valid team is undefined then need to return to the calling function
                }

                this.teamsSelected.push(validTeam);

                this.remainingTeams.splice(this.remainingTeams.indexOf(validTeam), 1);    //Remove the randomly selected team from the remaining array

                if (i === this.numberOfTeams / 2 - 1) this.teamsSelected.sort();      //Sort the first half of the teams
            }

            //If all of the teams have been processed successfully then return to the calling function
            if (this.remainingTeams.length === 0 && this.teamsSelected.length === this.numberOfTeams) {
                numberOfMatches = this.numberOfTeams / 2;
                for (i = 0; i < this.teamsSelected.length / 2; i++) {
                    setOfFixtures.push({ 'homeTeam': this.teamsSelected[i], 'awayTeam': this.teamsSelected[i + numberOfMatches], hasFixtureBeenPlayed: false })
                }
                return setOfFixtures;
            }
        }
    }

    private getRandomTeam(arrayIndex): string {
        //Get a random team, but if a team has played its last 2 matches away then it will automatically play at home
        let isHomeTeam: boolean = false;
        let teamNumber: number = 0;
        let counterExit1: number = 0;
        let counterExit2: number = 0;
        let counterExit3: number = 0;
        let index: number = 0;
        let arrayIndexOfTeamFound: number = -1;
        let teamsName: string = "";
        let opposingTeam: string = "";
        let thisTeam: Team;
        let teamsLeft: any[] = [];

        while (true) {

            isHomeTeam = (arrayIndex < this.numberOfTeams / 2);

            if (this.mandatoryHomeTeams.length > 0 && this.mandatoryHomeTeams.length - 1 >= arrayIndex) {
                // teamNumber = this._appDataTeams.indexOf(this._mandatoryHomeTeams[arrayIndex]);
                teamNumber = helpers.getPositionInArrayOfObjects(this.appDataTeams, "teamName", this.mandatoryHomeTeams[arrayIndex]);
            } else {
                //Get a random team, but not if this is a home team which is a mandatory away team for this set of fixtures
                teamNumber = -1;
                while (teamNumber === -1) {
                    if (counterExit1++ > NUMBER_OF_ATTEMPTS_TO_GET_RANDOM_TEAM) {
                        return undefined;       //Problem somewhere so exit out of the loop
                    }

                    //Make a temporary array from the remaining teams
                    teamsLeft = this.remainingTeams.slice();

                    if (isHomeTeam) {
                        //If a home team remove the mandatory away teams from _remainingTeams
                        for (index = 0; index < this.mandatoryAwayTeams.length; index++) {
                            arrayIndexOfTeamFound = teamsLeft.indexOf(this.mandatoryAwayTeams[index].teamName);
                            if (arrayIndexOfTeamFound !== -1) {
                                teamsLeft.splice(arrayIndexOfTeamFound, 1);
                            }
                        }

                        if (teamsLeft.length > 0) {
                            teamNumber = helpers.getRandomNumber(teamsLeft.length);
                            teamNumber = this.remainingTeams.indexOf(teamsLeft[teamNumber]);
                        }

                    } else {
                        //Away team, so remove the away teams that the corresponding home team has already played against
                        if (arrayIndex === this.numberOfTeams / 2) {
                            // this.checkWhoHomeTeamsHaveLeftToPlay(nIndex);
                        }

                        opposingTeam = this.teamsSelected[arrayIndex - ((this.numberOfTeams / 2))];
                        thisTeam = this.teams[helpers.getPositionInArrayOfObjects(this.appDataTeams, "teamName", opposingTeam)];

                        for (index = 0; index < thisTeam.teamsPlayedAtHome.length; index++) {
                            arrayIndexOfTeamFound = teamsLeft.indexOf(thisTeam.teamsPlayedAtHome[index].teamName);
                            if (arrayIndexOfTeamFound !== -1) {
                                teamsLeft.splice(arrayIndexOfTeamFound, 1);
                            }
                        }
                        if (teamsLeft.length > 0) {
                            teamNumber = helpers.getRandomNumber(teamsLeft.length);
                            teamNumber = this.remainingTeams.indexOf(teamsLeft[teamNumber]);
                        } else {
                            //No teams left for the corresponding home to play so abandon the loop
                            return undefined;
                        }
                    }
                }
            }

            teamsName = this.remainingTeams[teamNumber];

            thisTeam = this.teams[helpers.getPositionInArrayOfObjects(this.appDataTeams, "teamName", teamsName)];

            if (!isHomeTeam && thisTeam.fixtureAlreadyPlayed(opposingTeam)) {
                if (counterExit2++ > this.remainingTeams.length) {
                    return undefined;       //As the number of fixture options decrease might need to restart the function
                }
            } else if (isHomeTeam && thisTeam.allHomeGamesPlayed()) {             // Don't continue with this home team if they have already played all of their home matches
            } else if (!isHomeTeam && thisTeam.allAwayGamesPlayed()) {           // Don't continue with this away team if they have already played all of their away matches
            } else if (isHomeTeam && thisTeam.tooManyHomeGamesPlayed()) {         // Don't continue with this team if the number of home matches exceeds away matches by 2 (and 1 near the end of the season)
            } else if (!isHomeTeam && thisTeam.tooManyAwayGamesPlayed()) {       // Don't continue with this team if the number of away matches exceeds home matches by 2 (and 1 near the end of the season)
            } else if (isHomeTeam && thisTeam.numberOfHomeGamesPlayed() <= this.numberOfTeams / 2 && thisTeam.wereLastTwoMatchesAtHome()) {        //Check for consecutive matches (don't allow more than 2 at home within first half of season)
            } else if (thisTeam.hasPlayedOtherTeamRecently(opposingTeam)) {        //During first 3/4 of season do not allow a team to play against another team within 3 matches of each other
            } else if (thisTeam.numberOfMatchesPlayed() > 1 && thisTeam.venueLast() !== thisTeam.venuePrevious()) {       // The team is ok if the venue is different to the last
                return teamsName;
                // } else if (aThisTeam.NumberOfMatchesPlayed > 1 && (bIsHomeTeam && aThisTeam.VenueLast() === "A") || (! bIsHomeTeam && aThisTeam.VenueLast() === "H")) {
                // return sThisTeam;
            } else {
                return teamsName;       // Tests above failed so this team is ok, so break out of this loop
            }

            if (counterExit3++ > NUMBER_OF_ATTEMPTS_TO_GET_RANDOM_TEAM) {
                return undefined;       //Problem somewhere so exit out of the loop
            }
        }
    }

    private checkWhoHomeTeamsHaveLeftToPlay(arrayIndex): void {
        let teamsLeft: any[] = [];
        let thisTeam;
        let homeTeam: string;
        let teamPlayedAtHome: string;
        let logTeamsLeft: string = "";
        let i: number = 0;
        let j: number = 0;
        let arrayIndexOfTeamFound: number = 0;

        for (i = 0; i < this.appDataTeams.length / 2; i++) {
            teamsLeft = this.appDataTeams.slice();
            // sHomeTeam = aSetOfFixtures.Teams[i];
            homeTeam = this.teamsSelected[i];
            // aThisTeam = this.teams[this.appDataTeams.indexOfObject("teamName", homeTeam)];
            thisTeam = this.teams[helpers.getPositionInArrayOfObjects(this.appDataTeams, "teamName", homeTeam)];
            for (arrayIndex = 0; arrayIndex < thisTeam.teamsPlayedAtHome.length; arrayIndex++) {
                teamPlayedAtHome = thisTeam.teamsPlayedAtHome[arrayIndex].teamName;
                // var nTeamFound = aTeamsLeft.indexOf(sTeamPlayedAtHome);
                arrayIndexOfTeamFound = helpers.getPositionInArrayOfObjects(teamsLeft, "teamName", teamPlayedAtHome);
                if (arrayIndexOfTeamFound !== -1) {
                    teamsLeft.splice(arrayIndexOfTeamFound, 1);
                }
            }
            //Now remove the home team itself
            arrayIndexOfTeamFound = helpers.getPositionInArrayOfObjects(teamsLeft, "teamName", homeTeam);
            if (arrayIndexOfTeamFound !== -1) {
                teamsLeft.splice(arrayIndexOfTeamFound, 1);
            }

            if (thisTeam.orderOfFixtures.length > 32) {
                logTeamsLeft = "";
                for (j = 0; j < teamsLeft.length; j++) {
                    logTeamsLeft += teamsLeft[j].teamName + ", ";
                }
                console.log(homeTeam + " ...... " + logTeamsLeft);
            }
        }
        console.log('');
    }

    private getMandatoryTeams(homeOrAway): string[] {
        //Fill the appropriate array with teams that have played their last 2 games home/away and so must be home/away this time
        //However also check that the team hasn't played all of their season home/away matches
        //They are also a mandatory home/away team if the number of home/away games they have played exceeds the number of home/away games by 2 (and 1 near the end of the season)
        let mandatoryTeams: string[] = [];
        let matchesPlayedByTeam: number = 0;
        let matchesPlayedByTeamHere: number = 0;
        let matchesPlayedByTeamNotHere: number = 0;
        let numberToCompare: number = 0;
        let opposite: string = "";
        let i: number = 0;

        for (i = 0; i < this.numberOfTeams; i++) {

            if (homeOrAway === "H") {
                opposite = "A";
                matchesPlayedByTeamHere = this.teams[i].teamsPlayedAtHome.length;
                matchesPlayedByTeamNotHere = this.teams[i].teamsPlayedAway.length;
            } else {
                opposite = "H";
                matchesPlayedByTeamHere = this.teams[i].teamsPlayedAway.length;
                matchesPlayedByTeamNotHere = this.teams[i].teamsPlayedAtHome.length;            
            }

            matchesPlayedByTeam = this.teams[i].orderOfFixtures.length;

            if (matchesPlayedByTeam > 1) {
                //If a team has played all of its home/away matches then it must be at home/away
                if (matchesPlayedByTeamNotHere === this.numberOfTeams - 1) {
                    mandatoryTeams.push(this.teams[i].teamName);
                } else if (this.teams[i].orderOfFixtures[matchesPlayedByTeam - 1] === opposite && this.teams[i].orderOfFixtures[matchesPlayedByTeam - 2] === opposite) {
                    mandatoryTeams.push(this.teams[i].teamName);
                } else {
                    numberToCompare = (matchesPlayedByTeam <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) ? 2 : 2;
                    if (matchesPlayedByTeamNotHere - matchesPlayedByTeamHere >= numberToCompare) {
                        mandatoryTeams.push(this.teams[i].teamName);
                    }
                }
            }

        }
        return mandatoryTeams;
    }

}

import { DataService } from './../services/data.service';
import * as helpers from './../helper-functions/helpers';

export class Team {

    public teamName: string = "";
    public isATopTeam: boolean = false;
    public teamsPlayed: any[] = [];
    public teamsPlayedAtHome: any[] = [];
    public teamsPlayedAway: any[] = [];
    public orderOfFixtures: any[] = [];

    private numberOfTeams: number;

    constructor(dataService: DataService, arrayNumberOfTeam) {
        this.teamName = dataService.appData.teamsForSeason[arrayNumberOfTeam].teamName;
        this.isATopTeam = dataService.appData.teamsForSeason[arrayNumberOfTeam].isATopTeam;
        this.numberOfTeams = dataService.appData.miscInfo.numberOfTeams;
    }

    numberOfMatchesPlayed() { return this.orderOfFixtures.length; }

    numberOfHomeGamesPlayed() { return this.teamsPlayedAtHome.length; }

    allHomeGamesPlayed() { return (this.teamsPlayedAtHome.length === this.numberOfTeams - 1); }

    allAwayGamesPlayed() { return (this.teamsPlayedAway.length === this.numberOfTeams - 1); }

    venueLast() { return this.orderOfFixtures[this.orderOfFixtures.length - 1]; }

    venuePrevious() { return this.orderOfFixtures[this.orderOfFixtures.length - 2]; }

    fixtureAlreadyPlayed(opposingTeam) { return helpers.getPositionInArrayOfObjects(this.teamsPlayedAway, "teamName", opposingTeam) !== -1; }

    wereLastTwoMatchesAtHome() {
        let nMatchesPlayed = this.numberOfMatchesPlayed();
        if (nMatchesPlayed > 1 && (this.orderOfFixtures[nMatchesPlayed - 1] === "H" && this.orderOfFixtures[nMatchesPlayed - 2] === "H")) return true;
        return false;
    }

    tooManyHomeGamesPlayed() {
        //During the last 1/4 of season do not allow a team to play in total more than 1 home v away matches (before that it is 2)
        let nToCompare = (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) ? 2 : 2;
        return ((this.teamsPlayedAtHome.length - this.teamsPlayedAway.length) >= nToCompare);
    }

    tooManyAwayGamesPlayed() {
        //During the last 1/4 of season do not allow a team to play in total more than 1 away v home matches (before that it is 2)
        let nToCompare = (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) ? 2 : 2;
        return ((this.teamsPlayedAway.length - this.teamsPlayedAtHome.length) >= nToCompare);
    }

    hasPlayedOtherTeamRecently(opposingTeam) {
        let oppositionMatch: number;
        //During first 3/4 of season do not allow a team to play against another team within 3 matches of each other
        if (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) {
            oppositionMatch = helpers.getPositionInArrayOfObjects(this.teamsPlayed, "teamName", opposingTeam);
            if (oppositionMatch !== -1) {
                if (this.numberOfMatchesPlayed() - oppositionMatch < 4) return true;
            }
        }
        return false;
    }

    updateCheckArraysForTeam(opposingTeamName, dateOfFixture, venue) {
        this.teamsPlayed.push({ 'teamName': opposingTeamName, 'date': dateOfFixture, 'venue': venue });
    }

    updateCheckArraysForHomeTeam(awayTeamName, dateOfFixture) {
        this.teamsPlayedAtHome.push({ 'teamName': awayTeamName, 'date': dateOfFixture });
        this.orderOfFixtures.push('H');
    }

    updateCheckArraysForAwayTeam(homeTeamName, dateOfFixture) {
        this.teamsPlayedAway.push({ 'teamName': homeTeamName, 'date': dateOfFixture });
        this.orderOfFixtures.push('A');
    }
}


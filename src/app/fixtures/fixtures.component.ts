import { AllFixturesModel } from './../zzz-other/interfaces/interfaces';
import { DataService } from './../zzz-other/services/data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-fixtures',
    templateUrl: './fixtures.component.html',
    styleUrls: [
        '../zzz-other/css/fixtures.css',
        './fixtures.component.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class FixturesComponent implements OnInit {

    private fixturesForSeason: AllFixturesModel;
    public fixturesToOutput: AllFixturesModel;
    private dateOfLastSetOfFixtures: string;
    private urlParam: string;
    private displayResults: boolean;
    public displayHeader: string;    

    constructor(private dataService: DataService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        let i: number;

        this.fixturesForSeason = this.dataService.appData.allFixtures;
        this.dateOfLastSetOfFixtures = this.dataService.appData.miscInfo.dateOfLastSetOfFixtures;

        this.urlParam = this.route.snapshot.paramMap.get('displayResults');
        this.displayResults = ! (this.urlParam === null || this.urlParam === undefined);         // If the url returns just fixtures then set to false; if it returns fixtures + any value (e.g. fixtures/results) then set to true

        this.displayHeader = (this.displayResults) ? "Results for season" : "Remaining fixtures for season";

        if (this.dateOfLastSetOfFixtures === "" || this.dateOfLastSetOfFixtures === undefined || this.dateOfLastSetOfFixtures === null) {
            this.fixturesToOutput = (this.displayResults) ? [] : this.fixturesForSeason.slice(0);
        } else {
            for (i = 0; i < this.fixturesForSeason.length; i++) {
                if (this.fixturesForSeason[i].dateOfSetOfFixtures === this.dateOfLastSetOfFixtures) {
                    this.fixturesToOutput = (this.displayResults) ? this.fixturesForSeason.slice(0, i + 1) : this.fixturesForSeason.slice(i + 1);
                    break;
                }
            }
        }
    }
}

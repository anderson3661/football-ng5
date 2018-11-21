import { Component, OnInit, Input } from '@angular/core';
import { FixtureModel } from './../utilities/interfaces/interfaces';


@Component({
    selector: 'fixture-row',
    templateUrl: './fixture-row.component.html',
    styleUrls: ['./fixture-row.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class FixtureRowComponent implements OnInit {
    
    @Input() source: string;
    @Input() fixture: FixtureModel;
    @Input() fixturesInPlay: boolean;
    @Input() top3TeamsBeforeFixtures: string[];
    @Input() showGoals: boolean;
    @Input() winDrawLoss: string;

    public showForToBePlayed: boolean;
    public showForResults: boolean;
    public showForInPlay: boolean;
    public showForTeamStats: boolean;

    constructor() { }

    ngOnInit() {
        this.showForToBePlayed = (this.source === undefined || this.source === null ) ? false : this.source === "To Be Played";
        this.showForResults = (this.source === undefined || this.source === null ) ? false : this.source === "Results";
        this.showForInPlay = (this.source === undefined || this.source === null ) ? false : this.source === "In Play";
        this.showForTeamStats = (this.source === undefined || this.source === null ) ? false : this.source === "Team Stats";
    }

}

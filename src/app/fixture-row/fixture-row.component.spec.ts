import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureRowComponent } from './fixture-row.component';

describe('FixtureRowComponent', () => {
  let component: FixtureRowComponent;
  let fixture: ComponentFixture<FixtureRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

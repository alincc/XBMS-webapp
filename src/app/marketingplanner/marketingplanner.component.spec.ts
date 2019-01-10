import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingplannerComponent } from './marketingplanner.component';

describe('MarketingplannerComponent', () => {
  let component: MarketingplannerComponent;
  let fixture: ComponentFixture<MarketingplannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingplannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingchannelsComponent } from './marketingchannels.component';

describe('MarketingchannelsComponent', () => {
  let component: MarketingchannelsComponent;
  let fixture: ComponentFixture<MarketingchannelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingchannelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingchannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

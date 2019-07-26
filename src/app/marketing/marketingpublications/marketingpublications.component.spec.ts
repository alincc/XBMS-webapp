import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingpublicationsComponent } from './marketingpublications.component';

describe('MarketingpublicationsComponent', () => {
  let component: MarketingpublicationsComponent;
  let fixture: ComponentFixture<MarketingpublicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingpublicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingpublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

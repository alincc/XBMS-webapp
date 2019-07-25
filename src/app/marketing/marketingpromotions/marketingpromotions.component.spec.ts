import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingpromotionsComponent } from './marketingpromotions.component';

describe('MarketingpromotionsComponent', () => {
  let component: MarketingpromotionsComponent;
  let fixture: ComponentFixture<MarketingpromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingpromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingpromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

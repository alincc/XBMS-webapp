import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocreatorComponent } from './videocreator.component';

describe('VideocreatorComponent', () => {
  let component: VideocreatorComponent;
  let fixture: ComponentFixture<VideocreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideocreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideocreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

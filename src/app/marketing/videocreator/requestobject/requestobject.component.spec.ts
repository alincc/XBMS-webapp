import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestobjectComponent } from './requestobject.component';

describe('RequestobjectComponent', () => {
  let component: RequestobjectComponent;
  let fixture: ComponentFixture<RequestobjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestobjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestobjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

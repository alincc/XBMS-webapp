import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaileditorComponent } from './maileditor.component';

describe('MaileditorComponent', () => {
  let component: MaileditorComponent;
  let fixture: ComponentFixture<MaileditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaileditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaileditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

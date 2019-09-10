import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VectoruploadComponent } from './vectorupload.component';

describe('VectoruploadComponent', () => {
  let component: VectoruploadComponent;
  let fixture: ComponentFixture<VectoruploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VectoruploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectoruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagecreatorComponent } from './imagecreator.component';

describe('ImagecreatorComponent', () => {
  let component: ImagecreatorComponent;
  let fixture: ComponentFixture<ImagecreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagecreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagecreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

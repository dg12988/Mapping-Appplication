import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevGeocodeComponent } from './rev-geocode.component';

describe('RevGeocodeComponent', () => {
  let component: RevGeocodeComponent;
  let fixture: ComponentFixture<RevGeocodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevGeocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevGeocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

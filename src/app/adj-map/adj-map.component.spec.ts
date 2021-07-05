import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjMapComponent } from './adj-map.component';

describe('AdjMapComponent', () => {
  let component: AdjMapComponent;
  let fixture: ComponentFixture<AdjMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HackerDataComponent } from './hacker-data.component';

describe('HackerDataComponent', () => {
  let component: HackerDataComponent;
  let fixture: ComponentFixture<HackerDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HackerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

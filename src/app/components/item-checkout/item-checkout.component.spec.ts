import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCheckoutComponent } from './item-checkout.component';

describe('ItemCheckoutComponent', () => {
  let component: ItemCheckoutComponent;
  let fixture: ComponentFixture<ItemCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

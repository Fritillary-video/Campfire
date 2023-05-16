import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedVideoCardComponent } from './suggested-video-card.component';

describe('SuggestedVideoCardComponent', () => {
  let component: SuggestedVideoCardComponent;
  let fixture: ComponentFixture<SuggestedVideoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedVideoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedVideoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

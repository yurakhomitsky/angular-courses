import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStateComponent } from './loading-state.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingStateComponent ],
      imports: [MatProgressSpinnerModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

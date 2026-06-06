import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Construccion } from './construccion';

describe('Construccion', () => {
  let component: Construccion;
  let fixture: ComponentFixture<Construccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Construccion], providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Construccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


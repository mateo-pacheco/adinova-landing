import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Diseno } from './diseno';

describe('Diseno', () => {
  let component: Diseno;
  let fixture: ComponentFixture<Diseno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diseno], providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Diseno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


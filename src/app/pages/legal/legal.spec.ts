import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Legal } from './legal';

describe('Legal', () => {
  let component: Legal;
  let fixture: ComponentFixture<Legal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Legal], providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Legal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


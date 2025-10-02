import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSalones } from './gestion-salones';

describe('GestionSalones', () => {
  let component: GestionSalones;
  let fixture: ComponentFixture<GestionSalones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSalones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSalones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

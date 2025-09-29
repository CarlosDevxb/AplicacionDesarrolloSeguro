import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAlumno } from './menu-alumno';

describe('MenuAlumno', () => {
  let component: MenuAlumno;
  let fixture: ComponentFixture<MenuAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

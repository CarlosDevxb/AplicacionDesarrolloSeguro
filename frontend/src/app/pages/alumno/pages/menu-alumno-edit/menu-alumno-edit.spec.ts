import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAlumnoEdit } from './menu-alumno-edit';

describe('MenuAlumnoEdit', () => {
  let component: MenuAlumnoEdit;
  let fixture: ComponentFixture<MenuAlumnoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAlumnoEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAlumnoEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

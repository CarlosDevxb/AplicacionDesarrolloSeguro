import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablecerPass } from './establecer-pass';

describe('EstablecerPass', () => {
  let component: EstablecerPass;
  let fixture: ComponentFixture<EstablecerPass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablecerPass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablecerPass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPagosComponent } from './agregar-pagos.component';

describe('AgregarPagosComponent', () => {
  let component: AgregarPagosComponent;
  let fixture: ComponentFixture<AgregarPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPagosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

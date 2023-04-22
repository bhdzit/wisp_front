import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosMesComponent } from './pagos-mes.component';

describe('PagosMesComponent', () => {
  let component: PagosMesComponent;
  let fixture: ComponentFixture<PagosMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosMesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

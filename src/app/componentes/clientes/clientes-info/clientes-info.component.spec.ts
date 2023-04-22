import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesInfoComponent } from './clientes-info.component';

describe('ClientesInfoComponent', () => {
  let component: ClientesInfoComponent;
  let fixture: ComponentFixture<ClientesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

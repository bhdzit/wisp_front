import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorreComponent } from './torre.component';

describe('TorreComponent', () => {
  let component: TorreComponent;
  let fixture: ComponentFixture<TorreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TorreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorreInfoComponent } from './torre-info.component';

describe('TorreInfoComponent', () => {
  let component: TorreInfoComponent;
  let fixture: ComponentFixture<TorreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorreInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TorreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

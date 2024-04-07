import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NapInfoComponent } from './nap-info.component';

describe('NapInfoComponent', () => {
  let component: NapInfoComponent;
  let fixture: ComponentFixture<NapInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NapInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NapInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

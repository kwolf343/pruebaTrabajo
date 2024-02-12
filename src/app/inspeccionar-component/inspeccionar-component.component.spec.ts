import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionarComponentComponent } from './inspeccionar-component.component';

describe('InspeccionarComponentComponent', () => {
  let component: InspeccionarComponentComponent;
  let fixture: ComponentFixture<InspeccionarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspeccionarComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspeccionarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

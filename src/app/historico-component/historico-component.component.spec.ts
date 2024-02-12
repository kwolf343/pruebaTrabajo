import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoComponentComponent } from './historico-component.component';

describe('HistoricoComponentComponent', () => {
  let component: HistoricoComponentComponent;
  let fixture: ComponentFixture<HistoricoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

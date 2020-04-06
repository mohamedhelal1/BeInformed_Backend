import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoronaCasesComponent } from './corona-cases.component';

describe('CoronaCasesComponent', () => {
  let component: CoronaCasesComponent;
  let fixture: ComponentFixture<CoronaCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronaCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronaCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

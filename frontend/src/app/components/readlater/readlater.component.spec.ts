import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadlaterComponent } from './readlater.component';

describe('ReadlaterComponent', () => {
  let component: ReadlaterComponent;
  let fixture: ComponentFixture<ReadlaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadlaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadlaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInformationComponent } from './lead-information.component';

describe('LeadInformationComponent', () => {
  let component: LeadInformationComponent;
  let fixture: ComponentFixture<LeadInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

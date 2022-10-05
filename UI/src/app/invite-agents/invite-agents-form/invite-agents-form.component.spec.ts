import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAgentsFormComponent } from './invite-agents-form.component';

describe('InviteAgentsFormComponent', () => {
  let component: InviteAgentsFormComponent;
  let fixture: ComponentFixture<InviteAgentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteAgentsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAgentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

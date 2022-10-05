import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAgentsComponent } from './invite-agents.component';

describe('InviteAgentsComponent', () => {
  let component: InviteAgentsComponent;
  let fixture: ComponentFixture<InviteAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { URLManagerComponent } from './urlmanager.component';

describe('URLManagerComponent', () => {
  let component: URLManagerComponent;
  let fixture: ComponentFixture<URLManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ URLManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(URLManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

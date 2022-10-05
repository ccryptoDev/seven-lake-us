import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDocumentComponent } from './list-of-document.component';

describe('ListOfDocumentComponent', () => {
  let component: ListOfDocumentComponent;
  let fixture: ComponentFixture<ListOfDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

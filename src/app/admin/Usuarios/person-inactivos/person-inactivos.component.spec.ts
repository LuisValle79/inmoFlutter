import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonInactivosComponent } from './person-inactivos.component';

describe('PersonInactivosComponent', () => {
  let component: PersonInactivosComponent;
  let fixture: ComponentFixture<PersonInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonInactivosComponent]
    });
    fixture = TestBed.createComponent(PersonInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

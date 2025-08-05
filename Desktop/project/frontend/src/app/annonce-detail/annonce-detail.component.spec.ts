import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceDetailComponent } from './annonce-detail.component';

describe('AnnonceDetailComponent', () => {
  let component: AnnonceDetailComponent;
  let fixture: ComponentFixture<AnnonceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnonceDetailComponent]
    });
    fixture = TestBed.createComponent(AnnonceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

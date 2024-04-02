import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPriviewComponent } from './content-priview.component';

describe('ContentPriviewComponent', () => {
  let component: ContentPriviewComponent;
  let fixture: ComponentFixture<ContentPriviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentPriviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentPriviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

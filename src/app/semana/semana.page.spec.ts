import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SemanaPage } from './semana.page';

describe('SemanaPage', () => {
  let component: SemanaPage;
  let fixture: ComponentFixture<SemanaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SemanaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutArtistComponent } from './about-artist.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('AboutArtistComponent', () => {
  let component: AboutArtistComponent;
  let fixture: ComponentFixture<AboutArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutArtistComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('The Art of Wood Carving');
  });

  it('should render artist name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.subtitle')?.textContent).toContain('Silas Thorne');
  });
});

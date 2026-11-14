
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent - TORRESANA', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear la aplicación correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el título de TORRESANA', () => {
    expect(component.title).toBe('TORRESANA Future Business');
  });

  it('debería mostrar el componente de proveedores', () => {
    const elemento = fixture.nativeElement as HTMLElement;

    expect(
      elemento.querySelector('app-proveedores')
    ).toBeTruthy();
  });

});

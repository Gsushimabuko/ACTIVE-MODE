import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Buscar...'; // Placeholder personalizable
  @Output() addItem = new EventEmitter<any>(); // Emitir evento para agregar un ítem
  @Output() searchResultsChange = new EventEmitter<any[]>(); // Emitir resultados de búsqueda

  searchSubject = new Subject<string>(); // Controlar el término de búsqueda
  searchResults: any[] = []; // Resultados de búsqueda

  constructor(private uListasService: UListasService) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      if (searchTerm.trim() === '') {
        this.searchResults = [];
        this.searchResultsChange.emit(this.searchResults); // Emitir resultados vacíos
        return;
      }

      this.uListasService.getStudentsByLastName(searchTerm).subscribe({
        next: (results) => {
          this.searchResults = results;
          this.searchResultsChange.emit(this.searchResults); // Emitir resultados al componente padre
        },
        error: (error) => {
          console.error('Error al buscar estudiantes por apellido:', error);
        }
      });
    });
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim();
    this.searchSubject.next(searchTerm); // Emitir término de búsqueda
  }

  onAddItem(item: any) {
    this.addItem.emit(item); // Emitir el ítem seleccionado al componente padre
  }
}

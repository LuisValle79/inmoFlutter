import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { PersonService } from 'src/app/services/person.services';

@Component({
  selector: 'app-person-inactivos',
  templateUrl: './person-inactivos.component.html',
  styleUrls: ['./person-inactivos.component.css']
})
export class PersonInactivosComponent implements OnInit {
  inactivePersons: Person[] = []; // Array para almacenar personas inactivas

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadInactivePersons();
  }

  loadInactivePersons() {
    this.personService.getInactivePersons().subscribe(
      (data: Person[]) => {
        this.inactivePersons = data;
      },
      (error) => {
        console.error('Error fetching inactive persons: ', error);
      }
    );
  }

  activatePerson(personID: number) {
    this.personService.activatePerson(personID).subscribe(
      () => {
        // Actualizar la lista de personas inactivas después de activar
        this.loadInactivePersons();
        console.log('Persona activada exitosamente.');
      },
      (error) => {
        console.error('Error activating person: ', error);
      }
    );
  }

  deletePerson(personID: number) {
    if (confirm('¿Estás seguro de eliminar esta persona?')) {
      this.personService.delete(personID).subscribe(
        () => {
          // Actualizar la lista de personas inactivas después de eliminar
          this.loadInactivePersons();
          console.log('Persona eliminada exitosamente.');
        },
        (error) => {
          console.error('Error deleting person: ', error);
        }
      );
    }
  }

  exportToExcel() {
    // Lógica para exportar a Excel
    console.log('Exportar a Excel');
  }

  exportToCSV() {
    // Lógica para exportar a CSV
    console.log('Exportar a CSV');
  }

  exportToPDF() {
    // Lógica para exportar a PDF
    console.log('Exportar a PDF');
  }
}

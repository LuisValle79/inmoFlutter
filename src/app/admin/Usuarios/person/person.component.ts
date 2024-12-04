import { Person } from './../../../models/person.model';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { PersonService } from 'src/app/services/person.services';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonFormComponent } from 'src/app/forms/person-form/person-form.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: Person[] = [];
  searchName: string = '';
  searchLastName: string = '';
  searchDocumentType: string = '';
  searchDocumentNumber: string = '';
  noResultsMessageVisible: boolean = false;
  showForm: boolean = false;
  createdPerson: Person = new Person();
  editPerson: Person | null = null;

  constructor(private personService: PersonService,
              private http: HttpClient,
              private modalService: NgbModal,
  ) {}
  closeEditModal() {
    this.showForm = false;
  } closeCreatedModal() {
    this.showForm = false;
  }
  ngOnInit(): void {
    this.loadPersons();
  }

  openCreateModal(): void {
    this.createdPerson = new Person();
    this.showForm = true;

    const modalRef = this.modalService.open(PersonFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Person = this.createdPerson;
    modalRef.result.then(
      (result) => {
        if (result === 'created') {
        }
      },
      (reason) => {
        if (reason === 'closed') {
          this.closeCreatedModal();
        }
      }
    );
  }
  openEditModal(Person: Person): void {
    this.editPerson = Person;
    this.showForm = true;

    const modalRef = this.modalService.open(PersonFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Person = Person;
    modalRef.result.then(
      (result) => {
        if (result === 'edited') {
        }
      },
      (reason) => {
        if (reason === 'closed') {
          this.closeEditModal();
        }
      }
    );
  }

  loadPersons(): void {
    this.personService.getActivatePersons().subscribe(
      (data: Person[]) => {
        this.persons = data;
        this.checkNoResults();
      },
      (error) => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  searchPersons(): void {
    // Implement search logic based on searchName, searchLastName, searchDocumentType, searchDocumentNumber
    // Example: Call backend service with search criteria
  }

  clearSearch(): void {
    this.searchName = '';
    this.searchLastName = '';
    this.searchDocumentType = '';
    this.searchDocumentNumber = '';
    this.loadPersons(); // Reload all persons after clearing search
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Exportar a Excel',
      text: '¿Deseas exportar este listado de personas a Excel?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.get<any[]>('https://expert-potato-vxvgvrjqv792pv7p-9000.app.github.dev/v1/persons')
          .subscribe((data: any[]) => {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');

            const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'personas.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          });
      }
    });
  }

  exportToCSV(): void {
    Swal.fire({
      title: 'Exportar a CSV',
      text: '¿Deseas exportar este listado de personas a CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('https://expert-potato-vxvgvrjqv792pv7p-9000.app.github.dev/v1/persons')
          .then(response => response.json())
          .then(data => {
            const csvData = this.convertToCSV(data);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'personas.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error('Error al obtener datos:', error));
      }
    });
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  exportToPDF(): void {
    Swal.fire({
      title: 'Exportar a PDF',
      text: '¿Deseas exportar este listado de personas a PDF?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const doc = new jsPDF('p', 'mm', 'a4');
        autoTable(doc, {
          head: [['Nombre', 'Apellido', 'Tipo de Documento', 'Número de Documento', 'Teléfono', 'Estado', 'Rol']],
          body: this.persons.map(person => [
            person.name,
            person.lastName,
            person.documentType,
            person.documentNumber,
            person.phone,
            person.status,
            person.role
          ]),
          theme: 'grid',
          margin: { top: 10 },
          styles: {
            font: 'helvetica',
            fontStyle: 'bold',
            fontSize: 10
          },
          headStyles: { fillColor: [51, 122, 183] }
        });

        doc.save('personas.pdf');
      }
    });
  }


  delete(person: Person): void {
    Swal.fire({
      title: 'Eliminar Persona',
      text: `¿Estás seguro de eliminar a ${person.name} ${person.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personService.desactivatePerson(person.personID).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              'La persona ha sido eliminada correctamente.',
              'success'
            );
            this.loadPersons(); // Reload persons after deletion
          },
          (error: any) => {
            console.error('Error deleting person:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al intentar eliminar la persona.',
              'error'
            );
          }
        );
      }
    });
  }

  checkNoResults(): void {
    this.noResultsMessageVisible = this.persons.length === 0;
  }
}
function saveAs(data: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}


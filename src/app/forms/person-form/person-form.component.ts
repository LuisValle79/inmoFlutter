import { Component, OnInit } from '@angular/core';
import { Person } from './../../models/person.model'; // Asegúrate de importar correctamente tu modelo de Persona
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';
import { PersonService } from 'src/app/services/person.services';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  // Declaración de variables
  documentError: boolean = false;
  documentErrorMessage: string = '';
  Person: Person = new Person();
  userForm: any;
  numberDocument: any;
  nonNumericCharacters: boolean = false;
  errorMessages: string[] = []; // Para almacenar mensajes de error


  constructor(
    public personService: PersonService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadPerson();
  }

  loadPerson(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.personService.getPerson(id).subscribe((person) => this.Person = person);
      }
    });
  }

  create(): void {
    this.Person.status = 'Active';
  
    this.personService.create(this.Person).subscribe(
      createdPerson => {
        // Lógica para manejar la creación exitosa
        Swal.fire({
          title: 'Operación Exitosa',
          text: `Persona ${createdPerson.name} creada con éxito!`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok'
        }).then(() => {
          // Recargar la página para actualizar la lista de personas
          window.location.reload();
        });
      },
      error => {
        // Manejo de errores
        if (error.status === 400) {
          // Si el error es de validación (Bad Request)
          if (error.error && error.error.message && Array.isArray(error.error.message)) {
            this.errorMessages = error.error.message;
          } else {
            this.errorMessages = ['Error de validación. Por favor, revise los datos ingresados.'];
          }
        } else if (error.status === 409) {
          // Si el error es de conflicto (Duplicate entry, por ejemplo)
          this.errorMessages = ['Ya existe una persona con el mismo documento o correo electrónico.'];
        } else {
          this.errorMessages = ['Ha ocurrido un error al intentar crear la persona. Por favor, inténtelo nuevamente más tarde.'];
        }
  
        // Mostrar los mensajes de error en Swal
        Swal.fire({
          title: 'Error',
          text: this.errorMessages.join('<br>'),
          icon: 'error',
          confirmButtonText: 'Ok',
          html: true // Permitir HTML para mostrar los mensajes de error en líneas separadas
        });
      }
    );
  }
  

  update(): void {
    this.personService.update(this.Person).subscribe(() => {
      this.router.navigate(['/persons']); // Redirige a la lista de personas
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  // Método para obtener el patrón del documento según el tipo
  getDocumentPattern(): string {
    const documentType = this.Person.documentType;

    switch (documentType) {
      case 'DNI':
        return '\\d{8}'; // 8 dígitos para DNI
      case 'CE':
        return '\\d{12}'; // 12 dígitos para CE
      default:
        return ''; // Ajusta según los tipos de documento que manejes
    }
  }

  // Método para validar caracteres numéricos en el número de documento
  validateNumericCharacters() {
    const numericRegex = /^[0-9]+$/;
    this.nonNumericCharacters = !numericRegex.test(this.Person.documentNumber);
  }

  // Método para limpiar errores del documento
  clearDocumentError() {
    this.documentError = false;
    this.documentErrorMessage = '';
  }

  // Método que se ejecuta al cambiar el tipo de documento
  onTypeDocumentChange() {
    this.validateDocumentLength();
    this.clearDocumentError(); // Limpia el error al cambiar el tipo de documento
  }

  // Método para validar el documento según su longitud esperada
  validateDocument() {
    const documentType = this.Person.documentType;
    const documentNumber = this.Person.documentNumber;

    if (documentType === 'CE') {
      this.documentError = documentNumber.length !== 12 || !/^\d{12}$/.test(documentNumber);
      this.documentErrorMessage = 'El número de documento debe tener 12 dígitos para el tipo CE.';
    } else if (documentType === 'DNI') {
      this.documentError = documentNumber.length !== 8 || !/^\d{8}$/.test(documentNumber);
      this.documentErrorMessage = 'El número de documento debe tener 8 dígitos para el tipo DNI.';
    } else {
      // Puedes agregar más lógica según otros tipos de documento si es necesario
      this.documentError = false;
      this.documentErrorMessage = '';
    }
  }

  // Método para validar la longitud del número de documento según el tipo
  validateDocumentLength() {
    this.documentError = false; // Reinicia la bandera de error

    if (
      (this.Person.documentType === 'DNI' && this.Person.documentNumber.length !== 8) ||
      (this.Person.documentType === 'CE' && this.Person.documentNumber.length !== 12)
    ) {
      this.documentError = true; // Activa el error si la longitud no coincide con el tipo de documento
    }
  }

  // Método para comprobar si se excede la longitud permitida del número de documento
  exceedsDocumentLength(): boolean {
    return this.documentError && (
      (this.Person.documentType === 'DNI' && this.Person.documentNumber.length > 8) ||
      (this.Person.documentType === 'CE' && this.Person.documentNumber.length > 12)
    );
  }

  // Método para manejar el cambio de selección del tipo de documento
  selectionChanged(event: any) {
    const value = event.target.value;

    // Aquí ajusta la lógica según los tipos de documento que manejes
    this.userForm.controls['numberDocument'].clearValidators();

    if (value === 'DNI') {
      this.userForm.controls['numberDocument'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)
      ]);
    }

    if (value === 'CE') {
      this.userForm.controls['numberDocument'].setValidators([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ]);
    }

    this.numberDocument.updateValueAndValidity();
  }
}

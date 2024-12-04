import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl: string = 'https://expert-potato-vxvgvrjqv792pv7p-9000.app.github.dev/v1/persons';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  checkIfExists(documentNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkIfExists`, { documentNumber });
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  create(person: Person): Observable<Person> {
    // Asignamos el estado 'activo' al crear la persona
    person.status = 'activo';

    return this.http.post<Person>(this.apiUrl, person, { headers: this.httpHeaders });
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`).pipe(
      map(person => {
        if (person.status === 'activo') {
          return person;
        } else {
          throw new Error('La persona no está activa');
        }
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.httpHeaders });
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.personID}`, person, { headers: this.httpHeaders });
  }

  desactivatePerson(id: number): Observable<any> {
    const url = `${this.apiUrl}/desactivar/${id}`;
    return this.http.delete(url, { headers: this.httpHeaders });
  }

  activatePerson(id: number): Observable<any> {
    const url = `${this.apiUrl}/activate/${id}`;
    return this.http.put(url, null, { headers: this.httpHeaders });
  }

  getInactivePersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/inactivos`);
  }
  getActivatePersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/activos`);
  }
}

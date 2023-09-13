import { Injectable } from '@angular/core';
import { Item } from './item';
import { Note } from './note';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  urlBase = 'https://checklist-project-6d19b-default-rtdb.europe-west1.firebasedatabase.app';
  apiKey = "AIzaSyDHfzT2SPNeJAjLT0-kjUYyA1WPXL8727A";
  
  session: any;
  loggedIn = new Subject<any>()
  loggedInObs = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(username: any, password: any): Observable<any> {
    return this.getTeam().pipe(
      map((response:any) => {
        let teamresp = response;

        if (!Array.isArray(response)) {
          if (response === null) {
            teamresp = [];
          } else {
            teamresp = Object.values(response);
          }
        }

        let user = teamresp.find((person: any) => person !== null && person.name === username && person.password === password);
        if (user) {
          this.session = user;
          this.loggedIn.next(true);
          localStorage.setItem('session', JSON.stringify(user));
        }
        return user;
      })
    );
  }

  logout(){
    this.session = undefined;
    this.loggedIn.next(false);
    localStorage.removeItem('session');
  }

  updateItem(item: Item) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = this.urlBase + '/items/' + item.id + '.json';

    return this.http
      .put(url, JSON.stringify(item));
  }

  deleteItem(item: Item) {
    const url = this.urlBase + '/items/' + item.id + '.json';
    return this.http.delete<any>(url,);
  }

  getItems(): Observable<any> {
    const url = this.urlBase + '/items.json';
    return this.http.get<any>(url);  
  }

  deleteNote(note: Note): Observable<any> {
    const url = this.urlBase + '/notes/' + note.id + '.json';
    return this.http.delete<any>(url);
  }

  getNotes(): Observable<any> {
    const url = this.urlBase + '/notes.json';
    return this.http.get<any>(url);
  }

  updateNote(note: Note): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = this.urlBase + '/notes/' + note.id + '.json';

    return this.http
      .put(url, JSON.stringify(note));
  }

  getTeam(): Observable<any> {
    const url = this.urlBase + '/team.json';
    return this.http.get<any>(url);
  }

  getPerson(id: number): Observable<any>{
    const url = this.urlBase + '/team' + id + '.json';
    return this.http.get<any>(url);
  }
}

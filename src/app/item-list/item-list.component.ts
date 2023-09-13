import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../checklist.service';
import { Item } from '../item';
import { FormBuilder } from '@angular/forms';
import { Person } from '../person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  team: Person[] = [];

  filterForm = this.formBuilder.group({
    people: [],
    todo: false,
  });

  constructor(
    private formBuilder: FormBuilder,
    private checklistService: ChecklistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((evt: any) => {
        this.filterForm.valueChanges.subscribe((data) => {
          this.filter(data.people || [], data.todo || false);
        });
        this.filter([], false);
        this.loadTeam();
    });
  }

  deleteItem(item: Item) {
    this.checklistService.deleteItem(item).subscribe(() => {
      this.checklistService.getNotes().subscribe((response) => {
        let notesresp = response;
        if (!Array.isArray(notesresp)) {
          if (response === null) {
            notesresp = [];
          } else {
            notesresp = Object.values(response);
          }
        }

        notesresp = notesresp.filter((n: any) => n !== null && n.item === item.id);
        notesresp.forEach( (note: any) => {
          this.checklistService.deleteNote(note).subscribe();
        }); 

      });
      this.filter([], false);
    });
  }

  filter(people: Person[], todo: boolean) {
    this.checklistService.getItems().subscribe((response) => {
      let filtered = response;
      filtered = filtered.filter((i: Item) => i !== null);

      if (todo) {
        filtered = filtered.filter((i: Item) => !i.checked);
      }
      if (people.length != 0) {
        people.forEach((person) => {
          filtered = filtered.filter((i: Item) => i.people.includes(person.id));
        });
      }
      this.items = filtered;
    });
  }

  loadTeam() {
    this.checklistService.getTeam().subscribe((response) => {
      let teamresp = response;

      if (!Array.isArray(response)) {
        if (response === null) {
          teamresp = [];
        } else {
          teamresp = Object.values(response);
        }
      }

      this.team = teamresp.filter((note: any) => note !== null);
    });
  }

  getPersonById(id: number) {
    return this.team.filter((p) => p.id === id)[0];
  }

  updateItem(item: Item) {
    this.checklistService.updateItem(item).subscribe();
  }
}

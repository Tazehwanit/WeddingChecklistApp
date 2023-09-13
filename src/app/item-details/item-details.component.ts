import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistService } from '../checklist.service';
import { FormBuilder } from '@angular/forms';

import { Item } from '../item';
import { Note } from '../note';
import { Person } from '../person';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css'],
})
export class ItemDetailsComponent implements OnInit {
  item: Item | undefined;
  itemNotes: any[] = [];
  progress = 0;
  showForm = false;
  team: Person[] = [];

  noteForm = this.formBuilder.group({
    title: '',
    description: '',
    link: '',
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private checklistService: ChecklistService
  ) {}

  ngOnInit() {
    this.loadTeam();
    this.checklistService.getItems().subscribe((response) => {
      const routeParams = this.route.snapshot.paramMap;
      const itemIdFromRoute = Number(routeParams.get('itemId'));

      this.item = response.find(
        (item: Item) => item !== null && item.id === itemIdFromRoute
      );

      if (this.item !== undefined) {
        this.loadNotes();
      }
    });
  }

  updateProgress(note: any) {
    if (this.item != undefined) {
      this.checklistService.updateNote(note).subscribe();
      this.progress = this.amountOfNotesChecked(this.item);
    }
  }

  amountOfNotesChecked(item: any) {
    if (item != undefined) {
      return (
        (this.itemNotes.filter((note) => note.item === item.id && note.checked)
          .length /
          this.itemNotes.filter((note) => note.item === item.id).length) *
        100
      );
    } else {
      return 0;
    }
  }

  onSubmit() {
    if (this.item !== undefined) {
      this.checklistService.getNotes().subscribe((response) => {
        let notesresp = response;
        if (!Array.isArray(notesresp)) {
          if (response === null) {
            notesresp = [];
          } else {
            notesresp = Object.values(response);
          }
        }

        notesresp = notesresp.filter((item: any) => item !== null);
        if (this.item !== undefined) {
          const newNote: Note = {
            id: Math.max(...notesresp.map((o: any) => o.id)) + 1,
            title: this.noteForm.value.title || '',
            checked: false,
            item: this.item.id || 0,
            dateWritten: new Date(),
            description: this.noteForm.value.description || '',
            link: this.noteForm.value.link || '',
          };
          this.checklistService.updateNote(newNote).subscribe(() => {
            this.loadNotes();
            this.showForm = false;
          });
        }
      });
    }
  }

  onReset() {
    this.showForm = false;
  }

  addNote() {
    this.showForm = true;
  }

  deleteNote(note: Note) {
    if (this.item != undefined) {
      this.checklistService.deleteNote(note).subscribe((response) => {
        this.loadNotes();
      });
    }
  }

  loadNotes() {
    this.checklistService.getNotes().subscribe((response) => {
      let notes = response;

      if (!Array.isArray(response)) {
        if (response === null) {
          notes = [];
        } else {
          notes = Object.values(response);
        }
      }
      this.itemNotes = notes.filter(
        (note: any) =>
          note !== null && this.item != undefined && note.item === this.item.id
      );
      this.progress = this.amountOfNotesChecked(this.item);
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
}

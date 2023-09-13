import { Component } from '@angular/core';
import { ChecklistService } from '../checklist.service';
import { FormBuilder } from '@angular/forms';
import { Person } from '../person';
import { Item } from '../item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css'],
})
export class ItemAddComponent {
  team: Person[] = [];

  itemForm = this.formBuilder.group({
    title: '',
    location: '',
    description: '',
    people: [],
    deadline: new Date(),
  });

  constructor(
    private checklistService: ChecklistService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTeam();
  }

  onSubmit(): void {
    this.checklistService.getItems().subscribe((response) => {
      let itemsresp = response;

      if (!Array.isArray(response)) {
        if (response === null) {
          itemsresp = [];
        } else {
          itemsresp = Object.values(response);
        }
      }

      itemsresp = itemsresp.filter((item: any) => item !== null);
      const newItem: Item = {
        id: Math.max(...itemsresp.map((o: Item) => o.id)) + 1,
        checked: false,
        title: this.itemForm.value.title || '',
        location: this.itemForm.value.location || '',
        description: this.itemForm.value.description || '',
        people: this.itemForm.value.people || [],
        deadline: this.itemForm.value.deadline || new Date(),
      };

      this.checklistService.updateItem(newItem).subscribe();

      this.router.navigate(['/']);
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
}

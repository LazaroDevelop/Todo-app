import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
})
export class AddPeopleComponent implements OnInit {
  peopleForm!: FormGroup;
  $isMobileView = false;
  skills: string[] = [];
  sIndex: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AddPeopleComponent>,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.peopleForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      age: new FormControl(0, [Validators.required, Validators.min(18)]),
      skill: new FormControl(''),
    });

    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((result) => {
        this.$isMobileView = result.matches;
      });
  }

  onChange(event: string) {
    const index = this.skills.indexOf(event);
    this.sIndex = index;
  }

  savePerson() {
    if (this.peopleForm.valid) {
      const {name, age} = this.peopleForm.value;
      this.dialogRef.close({name, age, skills: this.skills});
    } else {
      this.snackBar.open('Please fill the form correctly', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  addSkill() {
    const skill = this.peopleForm.get('skill')?.value;
    if (skill) {
      this.skills.push(skill);
      this.peopleForm.get('skill')?.reset();
      this.snackBar.open('Skill added', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
    }
  }

  dropSkill() {
    this.skills.splice(this.sIndex, 1);
    this.snackBar.open('Skill removed', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });
  }
}

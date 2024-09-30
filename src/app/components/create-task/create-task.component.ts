import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { People } from 'src/app/models/people/people';
import { Task } from 'src/app/models/tasks/task';
import { TaskStatus } from 'src/app/models/tasks/task-status';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreTaskService } from './../../service/store-task.service';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
  },
};

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  form!: FormGroup;
  people: People[] = [];
  skills: string[] = [];
  skillControl = new FormControl('');
  skillIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private storeService: StoreTaskService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      endDate: new FormControl(new Date()),
      peopleName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      peopleAge: new FormControl(0, [Validators.required, Validators.min(18)]),
      peopleSkills: this.fb.array(
        [],
        [Validators.required, this.minLengthArray(1)]
      ),
    });
  }

  minLengthArray(min: number) {
    return (control: FormArray): { [key: string]: boolean } | null => {
      if (control.length >= min) {
        return null;
      }
      return { minLengthArray: true };
    };
  }

  onChange(event: number) {
    this.skillIndex = event;
  }

  addSkill() {
    const skill = this.skillControl.value;
    if (skill) {
      this.skills.push(skill);
      this.skillControl.reset();
      this.snackBar.open('Skill added susccefully', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
    } else {
      this.snackBar.open('The skill cannot be empty', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
    }
  }

  dropSkill() {
    this.skills.splice(this.skillIndex, 1);
  }

  savePerson() {
    if (this.skills.length === 0) {
      this.snackBar.open('At least one skill is required', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const { peopleName, peopleAge, peopleSkills } = this.form.value;

    if ((peopleName as string).trim() === '') {
      this.snackBar.open('The person name cannot be empty', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    if ((peopleAge as number) < 18) {
      this.snackBar.open('The person age must be greater than 18', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const person: People = {
      fullName: peopleName,
      age: peopleAge,
      skills: this.skills,
    };
    this.people.push(person);
    this.skills = [];
    this.form.patchValue({
      peopleName: '',
      peopleAge: 0,
      peopleSkills: [],
    });
  }

  dropPerson(index: number) {
    this.people.splice(index, 1);
  }

  saveTask() {

    if(this.people.length === 0){
      this.snackBar.open('At least one person is required', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const { name, endDate } = this.form.value;
    const status: TaskStatus = TaskStatus.PENDING;
    const task: Task = {
      id: Math.floor(Math.random() * 1000),
      name,
      endDate,
      status,
      people: this.people,
    };

    this.storeService.addTask(task);
    this.form.reset();
    this.people = [];
    this.snackBar.open('Task added successfully', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });
  }
}

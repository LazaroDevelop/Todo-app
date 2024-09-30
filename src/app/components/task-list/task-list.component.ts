import { MatCheckboxModule } from '@angular/material/checkbox';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StoreTaskService } from 'src/app/service/store-task.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Task } from 'src/app/models/tasks/task';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskStatus } from 'src/app/models/tasks/task-status';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { People } from 'src/app/models/people/people';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    DatePipe,
    NgFor,
    NgIf,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSnackBarModule
  ],
})
export class TaskListComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  tasksInMobile: Task[] = [];
  displayedColumns: string[] = [
    'no.',
    'status',
    'task_name',
    'final_date',
    'people',
    'delete',
  ];
  // displayedColumns: string[] = [
  //   'no.',
  //   'status',
  //   'task_name',
  //   'final_date',
  //   'people',
  //   'update',
  //   'delete',
  // ];
  dataSource = new MatTableDataSource(this.tasks);
  selection = new SelectionModel<Task>(true, []);
  $isMobileView = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private storeService: StoreTaskService,
    private breakPoints: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.storeService.getTasks().subscribe((value) => {
      this.tasks = value;
      this.tasksInMobile = value;
      this.dataSource = new MatTableDataSource(this.tasks);
    });

    this.breakPoints.observe([Breakpoints.Handset]).subscribe((result) => {
      this.$isMobileView = result.matches;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getIndex(element: Task) {
    return this.tasks.indexOf(element) + 1;
  }

  sortSomething(sortState: Sort) {}

  isSelected(task: Task): boolean {
    return task.status === 1 ? true : false;
  }

  toggleStatus(task: Task) {
    task.status =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks[index] = task;
    this.storeService.updateAllTasks(this.tasks);
    this.snackBar.open('Task status updated', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });
  }

  addPeople(){

  }

  dropPeople(person: People){
    if(this.tasks.length === 1){
      this.snackBar.open('You cannot remove the last person from the task', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }
    const index = this.tasks.findIndex((t) => t.people.includes(person));
    this.tasks[index].people = this.tasks[index].people.filter((p) => p !== person);
    this.storeService.updateAllTasks(this.tasks);
    this.snackBar.open('Person removed from task', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });

  }

  editTask(task: Task) {
    const updateTask = this.storeService.updateTask(task);
    const index = this.tasks.findIndex((t) => t.id === updateTask.id);
    this.tasks[index] = updateTask;
    this.dataSource = new MatTableDataSource(this.tasks);
  }

  deleteTask(task: Task) {
    const deleteTasks: Task[] = this.storeService.deleteTask(task);
    this.dataSource = new MatTableDataSource(deleteTasks);
    this.snackBar.open('Task deleted', 'Close', {
      duration: 2000,
      verticalPosition: 'bottom',
    });
  }

  filterTasks(event: MatButtonToggleChange) {
    const { value } = event;
    if (value === 'all' && !this.$isMobileView) {
      this.dataSource = new MatTableDataSource(this.tasks);
    } else {
      let statusValue: TaskStatus;
      if (value === 'completed') {
        statusValue = TaskStatus.COMPLETED;
      } else {
        statusValue = TaskStatus.PENDING;
      }
      const filteredTasks = this.tasks.filter((t) => t.status === statusValue);
      this.dataSource = new MatTableDataSource(filteredTasks);
    }
    if (value === 'all' && this.$isMobileView) {
      this.tasksInMobile = this.tasks;
    } else {
      let statusValue: TaskStatus;
      if (value === 'completed') {
        statusValue = TaskStatus.COMPLETED;
      } else {
        statusValue = TaskStatus.PENDING;
      }
      this.tasksInMobile = this.tasks.filter((t) => t.status === statusValue);
    }
  }
}

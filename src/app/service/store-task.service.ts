import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/tasks/task';

@Injectable({
  providedIn: 'root'
})
export class StoreTaskService {
  storeTask: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor() {
  }

  getTasks(): Observable<Task[]>{
    return this.storeTask.asObservable();
  }

  addTask(task: Task): void {
    const value: Task[] = this.storeTask.getValue();
    value.push({...task});
    this.storeTask.next(value);
  }

  updateTask(task: Task): Task{
    const value: Task[] = this.storeTask.getValue();
    const index = value.findIndex((t) => t.id === task.id);
    value[index] = task;
    this.storeTask.next(value);
    return task;
  }

  deleteTask(task: Task): void{
    const value: Task[] = this.storeTask.getValue();
    const index = value.findIndex((t) => t.id === task.id);
    value.splice(index, 1);
    this.storeTask.next(value);
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/tasks/task';

@Injectable({
  providedIn: 'root'
})
export class StoreTaskService {
  storeTask: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.storeTask.next(JSON.parse(storedTasks));
    }
  }

  getTasks(): Observable<Task[]>{
    return this.storeTask.asObservable();
  }

  addTask(task: Task): void {
    const value: Task[] = this.storeTask.getValue();
    value.push({...task});
    this.storeTask.next(value);
    localStorage.setItem('tasks', JSON.stringify(value));
  }

  updateAllTasks(tasks: Task[]): void{
    this.storeTask.next(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  updateTask(task: Task): Task{
    const value: Task[] = this.storeTask.getValue();
    const index = value.findIndex((t) => t.id === task.id);
    value[index] = task;
    this.storeTask.next(value);
    localStorage.setItem('tasks', JSON.stringify(value));
    return task;
  }

  deleteTask(task: Task): Task[]{
    const value: Task[] = this.storeTask.getValue();
    const index = value.findIndex((t) => t.id === task.id);
    value.splice(index, 1);
    this.storeTask.next(value);
    localStorage.setItem('tasks', JSON.stringify(value));
    return value;
  }

}

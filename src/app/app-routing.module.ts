import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { HomeComponent } from './components/home/home/home.component';
import { TaskListComponent } from './components/task-list/task-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home',  component: HomeComponent},
  {path: 'add_task', component: CreateTaskComponent},
  {path: 'task_list', component: TaskListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

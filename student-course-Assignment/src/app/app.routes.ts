import { Routes } from '@angular/router';


import { StudentsComponent } from './components/students/students.component';
import { CoursesComponent } from './components/courses/courses.component';
import { AssignStudentsComponent } from './components/assign-students/assign-students.component';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'students', component: StudentsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'assigned', component: AssignStudentsComponent },
  { path: '**', redirectTo: 'students' }
];

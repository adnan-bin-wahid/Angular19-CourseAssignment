import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login',
    loadComponent() {
      return import('./components/login/login.component').then((m) => m.LoginComponent);
    }
  },
  { 
    path: '',  
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => {
      return import('./components/students/students.component').then((m)=>m.StudentsComponent);
    },
  },
  { 
    path: 'students',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/students/students.component').then((m)=>m.StudentsComponent);
    },
  },
  { 
    path: 'create-student',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/students/create-student.component').then((m)=>m.CreateStudentComponent);
    },
  },
  { 
    path: 'courses',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/courses/courses.component').then((m)=>m.CoursesComponent);
    },
  },
  { 
    path: 'assigned',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/assign-students/assign-students.component').then((m)=>m.AssignStudentsComponent);
    },
  },
  { 
    path: 'create-course',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/courses/create-course/create-course.component').then((m)=>m.CreateCourseComponent);
    },
  },
  { 
    path: 'posts',
    canActivate: [authGuard],
    loadComponent() {
      return import('./components/posts/posts.component').then((m)=>m.PostsComponent);
    },
  },
  { path: '**', redirectTo: 'students' },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',  
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/students/students.component').then((m)=>m.StudentsComponent);
   },
  },
  { path: 'students',
    loadComponent() {
      return import('./components/students/students.component').then((m)=>m.StudentsComponent);
    },
   },
  { path: 'create-student', 
    loadComponent() {
      return import('./components/students/create-student.component').then((m)=>m.CreateStudentComponent);
    },
   },
  { path: 'courses', 
    loadComponent() {
      return import('./components/courses/courses.component').then((m)=>m.CoursesComponent);
    },
   },
  { path: 'assigned', 
    loadComponent() {
      return import('./components/assign-students/assign-students.component').then((m)=>m.AssignStudentsComponent);
    },
   },
  { path: 'create-course', 
    loadComponent() {
      return import('./components/courses/create-course/create-course.component').then((m)=>m.CreateCourseComponent);
    },
  },
  { path: '**', redirectTo: 'students' },
];

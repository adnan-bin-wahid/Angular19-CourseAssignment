import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-form">
      <h2>Create course</h2>
      <form (ngSubmit)="submit()">
        <label>
          Name
          <input name="name" [(ngModel)]="name" required />
        </label>
        <label>
          Course Code
          <input name="courseCode" [(ngModel)]="courseCode" required />
        </label>
        <div class="actions"> 
          <button type="submit">Submit</button>
          <button type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
    .create-form{max-width:520px;margin:20px auto;padding:18px;border-radius:8px;background:#fff}
    label{display:block;margin-bottom:12px}
    input{display:block;width:100%;padding:8px;margin-top:6px}
    .actions{margin-top:12px}
    button{margin-right:8px}
  `]
})
export class CreateCourseComponent {

  name = '';
  courseCode = '';

  constructor(private courses: CourseService, private router: Router) {

  }

  submit() {
    if (!this.name.trim() || !this.courseCode.trim()) return;
    this.courses.add({ name: this.name.trim(), courseCode: this.courseCode.trim() });
    this.router.navigate(['/courses']);
  }

  cancel(){
    this.router.navigate(['/courses']);
  }

}

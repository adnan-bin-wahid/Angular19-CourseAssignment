import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-create-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-form">
      <h2>Create student</h2>
      <form (ngSubmit)="submit()">
        <label>
          Name
          <input name="name" [(ngModel)]="name" required />
        </label>
        <label>
          Roll
          <input name="roll" [(ngModel)]="roll" required />
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
export class CreateStudentComponent {
  name = '';
  roll = '';

  constructor(private students: StudentService, private router: Router) {}

  submit() {
    if (!this.name.trim() || !this.roll.trim()) return;
    this.students.add({ name: this.name.trim(), rollNumber: this.roll.trim() });
    this.router.navigate(['/students']);
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  students$: Observable<Student[]>;

  constructor(private students: StudentService, private router: Router) {
    this.students$ = this.students.students$;
  }

  create() {
    this.router.navigate(['/create-student']);
  }

  delete(id: number) {
    if (!confirm('Delete this student?')) return;
    this.students.delete(id);
  }

  edit(s: Student) {
    const name = prompt('Edit name', s.name);
    const roll = prompt('Edit roll', s.rollNumber);
    if (name !== null && roll !== null) {
      this.students.update(s.id, { name: name.trim(), rollNumber: roll.trim() });
    }
  }
}


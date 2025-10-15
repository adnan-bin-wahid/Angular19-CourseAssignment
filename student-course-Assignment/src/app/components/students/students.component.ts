import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { ListComponent } from '../list/list.component';
import { ModalComponent } from '../modal/modal.component';
import { SimpleFormComponent, SimpleFormModel } from '../simple-form/simple-form.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent, ModalComponent, SimpleFormComponent],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  students$: Observable<Student[]>;
  editing: boolean = false;
  editModel: { id: number; name: string; rollNumber: string } | null = null;

  constructor(private students: StudentService, private router: Router) {
    this.students$ = this.students.students;
  }

  create() {
    this.router.navigate(['/create-student']);
  }

  delete(id: number) {
    if (!confirm('Delete this student?')) return;
    this.students.delete(id);
  }

  edit(s: Student) {
    this.editing = true;
    this.editModel = { id: s.id, name: s.name, rollNumber: s.rollNumber };
  }

  closeModal() {
    this.editing = false;
    this.editModel = null;
  }

  async saveEdit() {
    if (!this.editModel) return;
    const { id, name, rollNumber } = this.editModel;
    if (!name.trim() || !rollNumber.trim()) return;
    this.students.update(id, { name: name.trim(), rollNumber: rollNumber.trim() });
    this.closeModal();
  }

  onFormSave(m: SimpleFormModel) {
    if (!this.editModel) return;
    this.editModel.name = m.name;
    this.editModel.rollNumber = m.extra;
    this.saveEdit();
  }
}


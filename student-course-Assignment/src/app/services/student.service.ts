import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student, STUDENTS } from '../models/student';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private studentsSource = new BehaviorSubject<Student[]>([...STUDENTS]);
  students$ = this.studentsSource.asObservable();

  getCurrent() {
    return this.studentsSource.getValue();
  }

  add(student: Omit<Student, 'id'>) {
    const current = this.getCurrent();
    const id = current.length ? Math.max(...current.map(s => s.id)) + 1 : 1;
    const newStudent: Student = { id, ...student };
    this.studentsSource.next([...current, newStudent]);
    return newStudent;
  }

  update(id: number, updates: Partial<Student>) {
    const current = this.getCurrent().map(s => s.id === id ? { ...s, ...updates } : s);
    this.studentsSource.next(current);
  }

  delete(id: number) {
    const current = this.getCurrent().filter(s => s.id !== id);
    this.studentsSource.next(current);
  }
}

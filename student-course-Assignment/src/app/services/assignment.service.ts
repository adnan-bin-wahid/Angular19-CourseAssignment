import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../models/course';

export interface AssignedStudent {
  id: number;
  name: string;
  rollNumber: string;
  courses: Course[];
}

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private assignedSource = new BehaviorSubject<AssignedStudent[]>([]);
  assigned$ = this.assignedSource.asObservable();

  getCurrent() {
    return this.assignedSource.getValue();
  }

  assign(assigned: AssignedStudent) {
    const current = this.getCurrent();
    // if existing for this student id, replace
    const exists = current.find(a => a.id === assigned.id);
    if (exists) {
      const updated = current.map(a => a.id === assigned.id ? assigned : a);
      this.assignedSource.next(updated);
    } else {
      this.assignedSource.next([...current, assigned]);
    }
  }

  remove(id: number) {
    const current = this.getCurrent().filter(a => a.id !== id);
    this.assignedSource.next(current);
  }
}

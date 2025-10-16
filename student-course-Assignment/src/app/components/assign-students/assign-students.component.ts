
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AssignmentService, AssignedStudent } from '../../services/assignment.service';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { ListComponent } from '../list/list.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseSelectorComponent } from '../course-selector/course-selector.component';

@Component({
  selector: 'app-assign-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent, CourseSelectorComponent],
  templateUrl: './assign-students.component.html',
  styleUrls: ['./assign-students.component.css']
})
export class AssignStudentsComponent {
  students$: Observable<any>;
  courses: Course[] = [];
  assigned$: Observable<any>;
  assignedRows$: Observable<any[]>;

  selectedStudentId: number | null = null;
  checkedCourseIds = new Set<number>();

  constructor(private students: StudentService, private assignments: AssignmentService, private courseService: CourseService) {
    this.students$ = this.students.students;
    this.assigned$ = this.assignments.assigned$;
    this.courseService.courses.subscribe(list => this.courses = list);
    this.assignedRows$ = this.assigned$.pipe(
      map((list: AssignedStudent[]) => list.map(a => ({ ...a, coursesDisplay: a.courses.map(c => c.name).join(', ') })))
    );
  }

  onStudentChange(id: number | null) {
    this.selectedStudentId = id || null;
    
    this.checkedCourseIds = new Set<number>();

    if (!this.selectedStudentId) {
      return;
    }

    const assignedStudent = this.assignments.getCurrent().find(a => a.id === this.selectedStudentId);
    
    if (assignedStudent) {
      this.checkedCourseIds = new Set(assignedStudent.courses.map(c => c.id));
    } else {
      
      this.checkedCourseIds = new Set<number>();
    }

    setTimeout(() => {
      this.checkedCourseIds = new Set(this.checkedCourseIds);
    });
  }

  onCourseToggle(event: { courseId: number, checked: boolean }) {
    if (event.checked) this.checkedCourseIds.add(event.courseId);
    else this.checkedCourseIds.delete(event.courseId);
  }

  clearSelections() {
    this.selectedStudentId = null;
    
    this.checkedCourseIds = new Set<number>();
    
    setTimeout(() => {
      this.checkedCourseIds = new Set<number>();
    });
  }

  assign() {
    if (!this.selectedStudentId) return alert('Select a student first');
    const student = this.students.getCurrent().find(s => s.id === this.selectedStudentId);
    if (!student) return alert('Student not found');
    
    const selectedCourses = this.courses.filter(c => this.checkedCourseIds.has(c.id));
    const payload: AssignedStudent = { 
      id: student.id, 
      name: student.name, 
      rollNumber: student.rollNumber, 
      courses: selectedCourses 
    };
    
    this.assignments.assign(payload);
    
    this.clearSelections();
    

    setTimeout(() => {
      this.checkedCourseIds = new Set<number>();
      this.onStudentChange(null);
    }, 0);
  }

  loadForEdit(a: AssignedStudent) {
    this.clearSelections();

    setTimeout(() => {

      this.selectedStudentId = a.id;
      
      this.checkedCourseIds = new Set(a.courses.map(c => c.id));
      
      this.onStudentChange(a.id);
    });
  }

  unassign(id: number) {
    if (!confirm('Remove assignments for this student?')) return;
    this.assignments.remove(id);
  }

  getCourseNames(a: AssignedStudent) {
    return a.courses.map(c => c.name).join(', ');
  }
}
 

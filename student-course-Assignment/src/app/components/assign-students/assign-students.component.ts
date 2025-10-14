
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AssignmentService, AssignedStudent } from '../../services/assignment.service';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assign-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-students.component.html',
  styleUrls: ['./assign-students.component.css']
})
export class AssignStudentsComponent {
  students$: Observable<any>;
  courses: Course[] = [];
  assigned$: Observable<any>;

  // selection model
  selectedStudentId: number | null = null;
  checkedCourseIds = new Set<number>();

  constructor(private students: StudentService, private assignments: AssignmentService, private courseService: CourseService) {
    this.students$ = this.students.students;
    this.assigned$ = this.assignments.assigned$;
    // keep course list in sync with CourseService
    this.courseService.courses.subscribe(list => this.courses = list);
  }

  onStudentChange(id: number | null) {
    this.selectedStudentId = id || null;
    // load assigned courses if exist
    const assigned = this.assignments.getCurrent().find(a => a.id === this.selectedStudentId);
    this.checkedCourseIds.clear();
    if (assigned) assigned.courses.forEach(c => this.checkedCourseIds.add(c.id));
  }

  toggleCourse(courseId: number, checked: boolean) {
    if (checked) this.checkedCourseIds.add(courseId);
    else this.checkedCourseIds.delete(courseId);
  }

  assign() {
    if (!this.selectedStudentId) return alert('Select a student first');
    const student = this.students.getCurrent().find(s => s.id === this.selectedStudentId);
    if (!student) return alert('Student not found');
    const selectedCourses = this.courses.filter(c => this.checkedCourseIds.has(c.id));
    const payload: AssignedStudent = { id: student.id, name: student.name, rollNumber: student.rollNumber, courses: selectedCourses };
    this.assignments.assign(payload);
  }

  loadForEdit(a: AssignedStudent) {
    this.selectedStudentId = a.id;
    this.checkedCourseIds.clear();
    a.courses.forEach(c => this.checkedCourseIds.add(c.id));
    // update select and load checked courses
    this.onStudentChange(this.selectedStudentId);
  }

  unassign(id: number) {
    if (!confirm('Remove assignments for this student?')) return;
    this.assignments.remove(id);
  }

  getCourseNames(a: AssignedStudent) {
    return a.courses.map(c => c.name).join(', ');
  }
}
 

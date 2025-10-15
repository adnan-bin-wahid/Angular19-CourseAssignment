
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

  // selection model
  selectedStudentId: number | null = null;
  checkedCourseIds = new Set<number>();

  constructor(private students: StudentService, private assignments: AssignmentService, private courseService: CourseService) {
    this.students$ = this.students.students;
    this.assigned$ = this.assignments.assigned$;
    // keep course list in sync with CourseService
    this.courseService.courses.subscribe(list => this.courses = list);
    this.assignedRows$ = this.assigned$.pipe(
      // map each assigned to include a display field for courses
      // simple sync mapping
      map((list: AssignedStudent[]) => list.map(a => ({ ...a, coursesDisplay: a.courses.map(c => c.name).join(', ') })))
    );
  }

  onStudentChange(id: number | null) {
    this.selectedStudentId = id || null;
    // load assigned courses if exist
    const assigned = this.assignments.getCurrent().find(a => a.id === this.selectedStudentId);
    this.checkedCourseIds.clear();
    if (assigned) assigned.courses.forEach(c => this.checkedCourseIds.add(c.id));
  }

  onCourseToggle(event: { courseId: number, checked: boolean }) {
    if (event.checked) this.checkedCourseIds.add(event.courseId);
    else this.checkedCourseIds.delete(event.courseId);
  }

  clearSelections() {
    this.selectedStudentId = null;
    this.checkedCourseIds = new Set<number>();  // Create a new Set to force change detection
  }

  assign() {
    if (!this.selectedStudentId) return alert('Select a student first');
    const student = this.students.getCurrent().find(s => s.id === this.selectedStudentId);
    if (!student) return alert('Student not found');
    const selectedCourses = this.courses.filter(c => this.checkedCourseIds.has(c.id));
    const payload: AssignedStudent = { id: student.id, name: student.name, rollNumber: student.rollNumber, courses: selectedCourses };
    this.assignments.assign(payload);
    
    // Clear all selections after successful assignment
    this.clearSelections();
  }

  loadForEdit(a: AssignedStudent) {
    // First clear any existing selections
    this.clearSelections();
    
    // Then set the new selections
    setTimeout(() => {
      // Set the student ID
      this.selectedStudentId = a.id;
      
      // Set the selected courses
      this.checkedCourseIds = new Set(a.courses.map(c => c.id));
      
      // Force Angular change detection
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
 

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-list">
      <h4>Courses</h4>
      <div *ngFor="let course of courses">
        <label>
          <input 
            type="checkbox" 
            [checked]="isCourseSelected(course.id)"
            (change)="onToggleCourse(course.id, $any($event.target).checked)" 
          />
          {{ course.name }} ({{ course.courseCode }})
        </label>
      </div>
      <div class="assign-actions">
        <button (click)="onAssign()">Assign</button>
      </div>
    </div>
  `,
  styles: [`
    .course-list {
      margin-top: 1rem;
    }
    .assign-actions {
      margin-top: 1rem;
    }
  `]
})
export class CourseSelectorComponent implements OnChanges {
  @Input() courses: Course[] = [];
  @Input() set selectedCourseIds(value: Set<number>) {
    this._selectedCourseIds = new Set(value);
  }
  get selectedCourseIds(): Set<number> {
    return this._selectedCourseIds;
  }
  private _selectedCourseIds = new Set<number>();
  
  @Output() toggleCourse = new EventEmitter<{courseId: number, checked: boolean}>();
  @Output() assign = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCourseIds'] && changes['selectedCourseIds'].currentValue) {
      this._selectedCourseIds = new Set(changes['selectedCourseIds'].currentValue);
    }
  }

  onToggleCourse(courseId: number, checked: boolean) {
    this.toggleCourse.emit({ courseId, checked });
  }

  onAssign() {
    this.assign.emit();
  }

  isCourseSelected(courseId: number): boolean {
    return this._selectedCourseIds.has(courseId);
  }
}
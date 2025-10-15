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
      <div *ngFor="let course of courses; trackBy: trackByCourse">
        <label>
          <input 
            #cb
            type="checkbox" 
            [checked]="selectedIds.has(course.id)"
            [attr.data-course-id]="course.id"
            (change)="onToggleCourse(course.id, cb.checked)" 
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
  @Input() set selectedCourseIds(value: Set<number> | null) {
    this.selectedIds = new Set(value || []);
  }
  
  // Make this public for template access
  selectedIds = new Set<number>();
  
  @Output() toggleCourse = new EventEmitter<{courseId: number, checked: boolean}>();
  @Output() assign = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedCourseIds' in changes) {
      // Create new Set to force change detection
      this.selectedIds = new Set(changes['selectedCourseIds'].currentValue || []);
      
      // Force UI update
      setTimeout(() => {
        this.selectedIds = new Set(this.selectedIds);
        this.resetCheckboxes();
      });
    }
  }

  trackByCourse(index: number, course: Course): number {
    return course.id;
  }

  onToggleCourse(courseId: number, checked: boolean) {
    if (checked) {
      this.selectedIds.add(courseId);
    } else {
      this.selectedIds.delete(courseId);
    }
    this.toggleCourse.emit({ courseId, checked });
  }

  onAssign() {
    this.assign.emit();
    // Clear selections immediately
    this.selectedIds.clear();
    this.resetCheckboxes();
  }

  private resetCheckboxes() {
    // Force checkbox state reset
    setTimeout(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        const courseId = Number(cb.getAttribute('data-course-id'));
        cb.checked = this.selectedIds.has(courseId);
      });
    });
  }
}
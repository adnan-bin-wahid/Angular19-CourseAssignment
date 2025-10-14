import { Injectable } from '@angular/core';
import { Course,COURSES } from '../models/course';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSource = new BehaviorSubject<Course[]>([...COURSES]);
  courses = this.coursesSource.asObservable();

  getCurrent() {
    return this.coursesSource.getValue();
  }

  add(course: Omit<Course, 'id'>){
    const current = this.getCurrent();
    const id = current.length ? Math.max(...current.map(c =>c.id)) +1 : 1;
    const newCourse: Course = {id, ...course};
    this.coursesSource.next([...current, newCourse]);
    return newCourse;
  }

  update(id: number, updates: Partial<Course>){
    const current = this.getCurrent().map(c => c.id === id ? { ...c, ...updates}: c);
    this.coursesSource.next(current)
  }

  delete(id: number){
    const current = this.getCurrent().filter(c => c.id !== id);
    this.coursesSource.next(current)
  }
  
}

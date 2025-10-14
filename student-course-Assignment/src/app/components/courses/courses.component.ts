import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent {
  courses$: Observable<Course[]>;
  editing: boolean = false;
  editModel: { id: number; name: string; courseCode: string } | null = null;


  constructor(private courses: CourseService, private router: Router ){
    this.courses$ = this.courses.courses;
  }

  create(){
    this.router.navigate(['/create-course']);
  }

  delete(id: number){
    if(!confirm('Delete this course?')) return;
    this.courses.delete(id);
  }

  edit(c: Course){
    this.editing = true;
    this.editModel = { id: c.id, name: c.name, courseCode: c.courseCode };
  }

  closeModal(){
    this.editing = false;
    this.editModel = null;
  }

  async saveEdit(){
    if(!this.editModel) return;
    const { id, name, courseCode } = this.editModel;
    if(!name.trim() || !courseCode.trim()) return;
    this.courses.update(id, { name: name.trim(), courseCode: courseCode.trim() });
    this.closeModal();    
  }

}
 

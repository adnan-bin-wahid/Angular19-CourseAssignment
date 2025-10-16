import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post';

interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://dummyjson.com/posts';
  private postsSource = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSource.asObservable();

  private selectedPostSource = new BehaviorSubject<Post | null>(null);
  selectedPost$ = this.selectedPostSource.asObservable();

  constructor(private http: HttpClient) {}

  loadPosts(limit: number = 10) {
    this.http.get<PostsResponse>(`${this.apiUrl}?limit=${limit}`)
      .pipe(map(response => response.posts))
      .subscribe(posts => this.postsSource.next(posts));
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  setSelectedPost(post: Post | null) {
    this.selectedPostSource.next(post);
  }
}
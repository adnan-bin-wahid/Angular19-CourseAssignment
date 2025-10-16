import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <div *ngIf="!(selectedPost$ | async)">
        <h2>Posts</h2>
        <div class="posts-list">
          <div *ngFor="let post of posts$ | async" 
               class="post-item"
               (click)="selectPost(post)">
            <h3>{{ post.title }}</h3>
            <p>Views: {{ post.views }}</p>
            <p>Likes: {{ post.reactions.likes }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="selectedPost$ | async as post" class="post-detail">
        <button (click)="clearSelection()">Back to Posts</button>
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
        <div class="post-meta">
          <p>Views: {{ post.views }}</p>
          <p>Likes: {{ post.reactions.likes }} | Dislikes: {{ post.reactions.dislikes }}</p>
          <p>Tags: {{ post.tags.join(', ') }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .posts-list {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }
    .post-item {
      padding: 1rem;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .post-item:hover {
      background: #f5f5f5;
    }
    .post-detail {
      padding: 1rem;
    }
    button {
      margin-bottom: 1rem;
    }
    .post-meta {
      margin-top: 1rem;
      color: #666;
    }
  `]
})
export class PostsComponent implements OnInit {
  posts$: Observable<Post[]>;
  selectedPost$: Observable<Post | null>;

  constructor(private postService: PostService) {
    this.posts$ = this.postService.posts$;
    this.selectedPost$ = this.postService.selectedPost$;
  }

  ngOnInit() {
    this.postService.loadPosts(10);  // Load top 10 posts
  }

  selectPost(post: Post) {
    this.postService.getPostById(post.id)
      .subscribe(fullPost => this.postService.setSelectedPost(fullPost));
  }

  clearSelection() {
    this.postService.setSelectedPost(null);
  }
}
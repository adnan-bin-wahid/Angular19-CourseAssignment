import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="visible">
      <div class="modal">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close" (click)="close.emit()">✕</button>
        </header>
        <section class="modal-body">
          <ng-content></ng-content>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center}
    .modal{background:#fff;padding:18px;border-radius:8px;min-width:320px;box-shadow:0 8px 30px rgba(2,6,23,0.4)}
    .modal-header{display:flex;justify-content:space-between;align-items:center}
    .close{background:transparent;border:0;font-size:16px}
    .modal-body{margin-top:10px}
    `
  ]
})
export class ModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}

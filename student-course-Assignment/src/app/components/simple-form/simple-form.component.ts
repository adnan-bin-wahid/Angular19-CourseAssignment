import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SimpleFormModel { name: string; extra: string }

@Component({
  selector: 'app-simple-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()">
      <label>
        Name
        <input name="name" [(ngModel)]="model.name" required />
      </label>
      <label>
        {{ extraLabel }}
        <input name="extra" [(ngModel)]="model.extra" required />
      </label>
      <div class="actions">
        <button type="submit">{{ submitLabel }}</button>
        <button type="button" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `
})
export class SimpleFormComponent {
  @Input() model: SimpleFormModel = { name: '', extra: '' };
  @Input() extraLabel = 'Extra';
  @Input() submitLabel = 'Submit';
  @Output() save = new EventEmitter<SimpleFormModel>();
  @Output() cancel = new EventEmitter<void>();

  submit() {
    this.save.emit(this.model);
  }
}

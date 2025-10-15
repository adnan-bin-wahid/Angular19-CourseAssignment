import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="generic-list">
      <thead>
        <tr>
          <th *ngFor="let h of headers">{{ h }}</th>
          <th *ngIf="actionsTpl">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows; let i = index">
          <td *ngFor="let f of fields">
            {{ resolveField(row, f, i) }}
          </td>
          <td *ngIf="actionsTpl">
            <ng-container *ngTemplateOutlet="actionsTpl; context: {$implicit: row, index: i}"></ng-container>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
    .generic-list{width:100%;border-collapse:collapse}
    .generic-list th,.generic-list td{padding:8px;border:1px solid #e6e6e6;text-align:left}
    `
  ]
})
export class ListComponent {
  @Input() headers: string[] = [];
  @Input() fields: string[] = [];
  @Input() rows: any[] = [];

  @ContentChild('actions', { read: TemplateRef }) actionsTpl?: TemplateRef<any>;

  resolveField(row: any, field: string, index: number) {
    if (field === '$index') return index + 1;
    return row ? row[field] : '';
  }
}

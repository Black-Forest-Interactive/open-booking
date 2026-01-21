import {Component, computed, resource, signal} from '@angular/core';
import {LabelService} from "@open-booking/admin";
import {MatPaginatorModule} from "@angular/material/paginator";
import {toPromise} from "@open-booking/shared";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {FormsModule} from "@angular/forms";

import {Label, LabelChangeRequest} from "@open-booking/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MainContentComponent} from "../../shared/main-content/main-content.component";

@Component({
  selector: 'app-label',
  imports: [
    FormsModule,
    DragDropModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    MainContentComponent
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
})
export class LabelComponent {

  readonly COLORS = [
    "#0070C0", "#A6A6A6", "#BF8F00", "#B4C6E7",
    "#000000", "#00B050", "#FFFFFF", "#FF0000",
    "#FF99FF", "#FF9900", "#7030A0", "#FFFF00"
  ]

  // Resource for loading data
  private labelResource = resource({
    loader: (param) => {
      return toPromise(this.service.getAllLabelSorted(), param.abortSignal)
    }
  });

  private page = computed(() => this.labelResource.value())
  entries = computed(() => this.page() ?? [])
  reloading = this.labelResource.isLoading

  // Edit state
  editingId = signal<number | null>(null)
  editName = ''
  editColor = ''
  editPriority = 0
  saving = signal(false)


  constructor(private service: LabelService) {
  }

  protected autoGenerate() {
    this.saving.set(true)
    try {
      const maxPriority = Math.max(...this.entries().map(l => l.priority), 1)
      let requests = this.COLORS.filter(c => !this.entries().find(e => e.color === c))
        .map((c, i) => new LabelChangeRequest("Label " + i, c, maxPriority + i))

      requests.forEach(r =>
        this.service.createLabel(r).subscribe()
      )
      this.labelResource.reload()
    } catch (error) {
      console.error('Error creating label:', error);
    } finally {
      this.saving.set(false)
    }
  }

  async addLabel(): Promise<void> {
    this.saving.set(true);
    try {
      const maxPriority = Math.max(...this.entries().map(l => l.priority), -1);
      const usedColors = new Set(this.entries().map(l => l.color.toUpperCase()));

      let newColor = this.COLORS.find(c => !usedColors.has(c.toUpperCase()));

      if (!newColor) {
        do {
          newColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        } while (usedColors.has(newColor));
      }

      const request: LabelChangeRequest = {
        name: "Label " + (maxPriority + 1),
        color: newColor,
        priority: maxPriority + 1
      };

      const newLabel = await toPromise(this.service.createLabel(request));
      this.labelResource.reload();
      this.startEdit(newLabel);
    } catch (error) {
      console.error('Error creating label:', error);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteLabel(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this label?')) {
      return;
    }

    this.saving.set(true);
    try {
      await toPromise(this.service.deleteLabel(id));
      this.labelResource.reload();
    } catch (error) {
      console.error('Error deleting label:', error);
    } finally {
      this.saving.set(false);
    }
  }

  startEdit(label: Label): void {
    this.editingId.set(label.id);
    this.editName = label.name;
    this.editColor = label.color;
    this.editPriority = label.priority;
  }

  async saveEdit(label: Label): Promise<void> {
    const id = this.editingId();
    if (id === null) return;

    this.saving.set(true);
    try {
      const request: LabelChangeRequest = {
        name: this.editName,
        color: this.editColor,
        priority: this.editPriority
      };

      await toPromise(this.service.updateLabel(id, request));
      this.labelResource.reload();
      this.editingId.set(null);
    } catch (error) {
      console.error('Error updating label:', error);
    } finally {
      this.saving.set(false);
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  async drop(event: CdkDragDrop<Label[]>): Promise<void> {
    if (event.previousIndex === event.currentIndex) return;

    const items = [...this.entries()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    this.saving.set(true);
    try {
      // Update priorities for all affected labels
      const updates = items.map((label, index) => {
        if (label.priority !== index) {
          const request: LabelChangeRequest = {
            name: label.name,
            color: label.color,
            priority: index
          };
          return toPromise(this.service.updateLabel(label.id, request));
        }
        return Promise.resolve(label);
      });

      await Promise.all(updates);
      this.labelResource.reload();
    } catch (error) {
      console.error('Error updating priorities:', error);
    } finally {
      this.saving.set(false);
    }
  }

  getTextColor(bgColor: string): string {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

}

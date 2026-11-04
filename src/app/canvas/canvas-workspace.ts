import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CanvasStateService } from '../core/canvas-state.service';
import { ResizeBox } from './resize-box';

@Component({
  selector: 'app-canvas-workspace',
  imports: [DecimalPipe, ResizeBox],
  template: `
    <div class="main-toolbar">
      <h1>Workspace</h1>
      <p>
        {{ canvas.width() | number: '1.0-1' }} × {{ canvas.height() | number: '1.0-1' }} rem ·
        {{ canvas.left() | number: '1.0-1' }}, {{ canvas.top() | number: '1.0-1' }}
      </p>
    </div>

    <div class="canvas">
      <app-resize-box />
    </div>
  `,
  styles: `
    :host {
      grid-area: main;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-width: 0;
      padding: 1rem 1.25rem 1.25rem;
    }

    .main-toolbar {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .main-toolbar h1 {
      margin: 0;
      font-size: 1rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .main-toolbar p {
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--muted);
    }

    .canvas {
      position: relative;
      min-height: 0;
      border: 1px dashed color-mix(in oklab, var(--border) 80%, var(--accent));
      background:
        linear-gradient(
            to right,
            color-mix(in oklab, var(--border) 55%, transparent) 1px,
            transparent 1px
          )
          0 0 / 1.5rem 1.5rem,
        linear-gradient(
            to bottom,
            color-mix(in oklab, var(--border) 55%, transparent) 1px,
            transparent 1px
          )
          0 0 / 1.5rem 1.5rem,
        color-mix(in oklab, var(--surface) 70%, transparent);
      overflow: auto;
    }
  `,
})
export class CanvasWorkspace {
  protected readonly canvas = inject(CanvasStateService);
}

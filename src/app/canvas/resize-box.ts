import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CanvasStateService } from '../core/canvas-state.service';

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

@Component({
  selector: 'app-resize-box',
  template: `
    <div
      #box
      class="resize-box"
      [class.dragging]="dragging()"
      [style.width.rem]="canvas.width()"
      [style.height.rem]="canvas.height()"
      [style.left.rem]="canvas.left()"
      [style.top.rem]="canvas.top()"
      role="group"
      tabindex="0"
      aria-label="Draggable resizable rectangle. Arrow keys move. Drag body to move, edges to resize."
      (pointerdown)="onDragPointerDown($event)"
      (keydown)="onKeydown($event)"
    >
      <span class="resize-label">Drag to move · edges to resize</span>

      @for (handle of handles; track handle.edge) {
        <button
          type="button"
          [attr.class]="'handle ' + handle.className"
          [attr.aria-label]="handle.label"
          (pointerdown)="onResizePointerDown($event, handle.edge)"
        ></button>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }

    .resize-box {
      position: absolute;
      display: grid;
      place-items: center;
      min-width: 12rem;
      min-height: 8rem;
      border: 1px solid var(--accent);
      background: color-mix(in oklab, var(--surface) 82%, var(--accent));
      cursor: grab;
      touch-action: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .resize-box.dragging {
      cursor: grabbing;
    }

    .resize-box:focus-visible {
      outline: 2px solid var(--text);
      outline-offset: 3px;
    }

    .resize-label {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text);
      pointer-events: none;
    }

    .handle {
      position: absolute;
      padding: 0;
      border: 0;
      background: var(--accent);
      appearance: none;
      touch-action: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .handle:focus-visible {
      outline: 2px solid var(--text);
      outline-offset: 2px;
    }

    .handle-n,
    .handle-s {
      left: 20%;
      width: 60%;
      height: 0.35rem;
      cursor: ns-resize;
    }

    .handle-e,
    .handle-w {
      top: 20%;
      width: 0.35rem;
      height: 60%;
      cursor: ew-resize;
    }

    .handle-n {
      top: -0.175rem;
    }

    .handle-s {
      bottom: -0.175rem;
    }

    .handle-e {
      right: -0.175rem;
    }

    .handle-w {
      left: -0.175rem;
    }

    .handle-ne,
    .handle-nw,
    .handle-se,
    .handle-sw {
      width: 0.7rem;
      height: 0.7rem;
    }

    .handle-ne {
      top: -0.35rem;
      right: -0.35rem;
      cursor: nesw-resize;
    }

    .handle-nw {
      top: -0.35rem;
      left: -0.35rem;
      cursor: nwse-resize;
    }

    .handle-se {
      right: -0.35rem;
      bottom: -0.35rem;
      cursor: nwse-resize;
    }

    .handle-sw {
      left: -0.35rem;
      bottom: -0.35rem;
      cursor: nesw-resize;
    }
  `,
})
export class ResizeBox {
  private readonly boxRef = viewChild.required<ElementRef<HTMLElement>>('box');
  protected readonly canvas = inject(CanvasStateService);

  protected readonly dragging = signal(false);

  protected readonly handles: { edge: ResizeEdge; className: string; label: string }[] = [
    { edge: 'n', className: 'handle-n', label: 'Resize from top' },
    { edge: 's', className: 'handle-s', label: 'Resize from bottom' },
    { edge: 'e', className: 'handle-e', label: 'Resize from right' },
    { edge: 'w', className: 'handle-w', label: 'Resize from left' },
    { edge: 'ne', className: 'handle-ne', label: 'Resize from top right' },
    { edge: 'nw', className: 'handle-nw', label: 'Resize from top left' },
    { edge: 'se', className: 'handle-se', label: 'Resize from bottom right' },
    { edge: 'sw', className: 'handle-sw', label: 'Resize from bottom left' },
  ];

  protected onDragPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('.handle')) {
      return;
    }

    event.preventDefault();
    const box = this.boxRef().nativeElement;
    const surface = this.canvasSurface(box);
    if (!surface) {
      return;
    }

    box.setPointerCapture(event.pointerId);
    this.dragging.set(true);

    const rem = this.remSize();
    const boxRect = box.getBoundingClientRect();
    const offsetX = event.clientX - boxRect.left;
    const offsetY = event.clientY - boxRect.top;
    const widthPx = boxRect.width;
    const heightPx = boxRect.height;

    const onMove = (moveEvent: PointerEvent) => {
      if (!box.hasPointerCapture(moveEvent.pointerId)) {
        return;
      }

      const origin = this.canvasOrigin(surface);
      const maxLeft = Math.max(0, surface.clientWidth - widthPx);
      const maxTop = Math.max(0, surface.clientHeight - heightPx);
      const nextLeftPx = Math.min(
        Math.max(moveEvent.clientX - origin.x + surface.scrollLeft - offsetX, 0),
        maxLeft,
      );
      const nextTopPx = Math.min(
        Math.max(moveEvent.clientY - origin.y + surface.scrollTop - offsetY, 0),
        maxTop,
      );

      this.canvas.setPosition(nextLeftPx / rem, nextTopPx / rem);
    };

    const onLostCapture = () => {
      this.dragging.set(false);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('lostpointercapture', onLostCapture);
    };

    box.addEventListener('pointermove', onMove);
    box.addEventListener('lostpointercapture', onLostCapture);
  }

  protected onResizePointerDown(event: PointerEvent, edge: ResizeEdge): void {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.currentTarget as HTMLElement;
    const box = this.boxRef().nativeElement;
    const surface = this.canvasSurface(box);
    if (!surface) {
      return;
    }

    target.setPointerCapture(event.pointerId);

    const rem = this.remSize();
    const startRect = box.getBoundingClientRect();
    const fixedLeft = startRect.left;
    const fixedRight = startRect.right;
    const fixedTop = startRect.top;
    const fixedBottom = startRect.bottom;
    const minW = 12 * rem;
    const maxW = 48 * rem;
    const minH = 8 * rem;
    const maxH = 36 * rem;

    const onMove = (moveEvent: PointerEvent) => {
      if (!target.hasPointerCapture(moveEvent.pointerId)) {
        return;
      }

      let left = fixedLeft;
      let right = fixedRight;
      let top = fixedTop;
      let bottom = fixedBottom;

      if (edge.includes('e')) {
        right = Math.min(Math.max(moveEvent.clientX, left + minW), left + maxW);
      }
      if (edge.includes('w')) {
        left = Math.min(Math.max(moveEvent.clientX, right - maxW), right - minW);
      }
      if (edge.includes('s')) {
        bottom = Math.min(Math.max(moveEvent.clientY, top + minH), top + maxH);
      }
      if (edge.includes('n')) {
        top = Math.min(Math.max(moveEvent.clientY, bottom - maxH), bottom - minH);
      }

      const origin = this.canvasOrigin(surface);
      this.canvas.setBounds(
        (left - origin.x + surface.scrollLeft) / rem,
        (top - origin.y + surface.scrollTop) / rem,
        (right - left) / rem,
        (bottom - top) / rem,
      );
    };

    const onLostCapture = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('lostpointercapture', onLostCapture);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('lostpointercapture', onLostCapture);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 1 : 0.25;
    let dx = 0;
    let dy = 0;

    switch (event.key) {
      case 'ArrowLeft':
        dx = -step;
        break;
      case 'ArrowRight':
        dx = step;
        break;
      case 'ArrowUp':
        dy = -step;
        break;
      case 'ArrowDown':
        dy = step;
        break;
      default:
        return;
    }

    event.preventDefault();
    const box = this.boxRef().nativeElement;
    const surface = this.canvasSurface(box);
    if (!surface) {
      return;
    }

    const rem = this.remSize();
    const maxLeft = Math.max(0, surface.clientWidth / rem - this.canvas.width());
    const maxTop = Math.max(0, surface.clientHeight / rem - this.canvas.height());
    this.canvas.setPosition(
      Math.min(Math.max(this.canvas.left() + dx, 0), maxLeft),
      Math.min(Math.max(this.canvas.top() + dy, 0), maxTop),
    );
  }

  private canvasSurface(box: HTMLElement): HTMLElement | null {
    return box.closest('.canvas');
  }

  /** Padding-box origin in viewport coords (CSS absolute left/top reference). */
  private canvasOrigin(surface: HTMLElement): { x: number; y: number } {
    const rect = surface.getBoundingClientRect();
    return {
      x: rect.left + surface.clientLeft,
      y: rect.top + surface.clientTop,
    };
  }

  private remSize(): number {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}

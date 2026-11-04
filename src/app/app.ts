import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';

type ColorScheme = 'light' | 'dark';

@Component({
  imports: [RouterOutlet, DecimalPipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly title = signal('a001');
  protected readonly scheme = signal<ColorScheme>('dark');

  protected readonly boxWidth = signal(22);
  protected readonly boxHeight = signal(14);

  constructor() {
    afterNextRender(() => {
      this.scheme.set(this.readStoredScheme());
      this.applyScheme(this.scheme());

      const onStorage = (event: StorageEvent) => {
        if (event.key !== 'color-scheme') {
          return;
        }
        const next = this.readStoredScheme();
        this.scheme.set(next);
        this.applyScheme(next);
      };

      window.addEventListener('storage', onStorage);
      this.destroyRef.onDestroy(() => window.removeEventListener('storage', onStorage));
    });
  }

  protected toggleTheme(): void {
    const next: ColorScheme = this.scheme() === 'dark' ? 'light' : 'dark';
    this.scheme.set(next);
    this.persistScheme(next);
    this.applyScheme(next);
  }

  protected onResizePointerDown(event: PointerEvent, edge: string): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startW = this.boxWidth();
    const startH = this.boxHeight();
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const onMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / rem;
      const dy = (moveEvent.clientY - startY) / rem;

      let nextW = startW;
      let nextH = startH;

      if (edge.includes('e')) {
        nextW = startW + dx;
      }
      if (edge.includes('w')) {
        nextW = startW - dx;
      }
      if (edge.includes('s')) {
        nextH = startH + dy;
      }
      if (edge.includes('n')) {
        nextH = startH - dy;
      }

      this.boxWidth.set(Math.min(48, Math.max(12, nextW)));
      this.boxHeight.set(Math.min(36, Math.max(8, nextH)));
    };

    const onUp = () => {
      target.releasePointerCapture(event.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  }

  private readStoredScheme(): ColorScheme {
    try {
      const stored = localStorage.getItem('color-scheme');
      return stored === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }

  private persistScheme(scheme: ColorScheme): void {
    try {
      localStorage.setItem('color-scheme', scheme);
    } catch {
      // Persistence can fail when storage is blocked; theme still applies in-session.
    }
  }

  private applyScheme(scheme: ColorScheme): void {
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', scheme);
    }
  }
}

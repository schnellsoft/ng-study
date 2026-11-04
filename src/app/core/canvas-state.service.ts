import { Injectable, signal } from '@angular/core';
import { BoxState, DEFAULT_SAVED_SETTINGS } from './saved-settings.model';

@Injectable({ providedIn: 'root' })
export class CanvasStateService {
  readonly width = signal(DEFAULT_SAVED_SETTINGS.box.width);
  readonly height = signal(DEFAULT_SAVED_SETTINGS.box.height);
  readonly left = signal(DEFAULT_SAVED_SETTINGS.box.left);
  readonly top = signal(DEFAULT_SAVED_SETTINGS.box.top);

  snapshot(): BoxState {
    return {
      width: this.width(),
      height: this.height(),
      left: this.left(),
      top: this.top(),
    };
  }

  apply(box: BoxState): void {
    this.width.set(box.width);
    this.height.set(box.height);
    this.left.set(box.left);
    this.top.set(box.top);
  }

  setPosition(left: number, top: number): void {
    this.left.set(left);
    this.top.set(top);
  }

  setSize(width: number, height: number): void {
    this.width.set(width);
    this.height.set(height);
  }

  setBounds(left: number, top: number, width: number, height: number): void {
    this.left.set(left);
    this.top.set(top);
    this.width.set(width);
    this.height.set(height);
  }
}

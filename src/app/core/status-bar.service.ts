import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StatusBarService {
  readonly message = signal('Ready');
  readonly lastSavedAt = signal<string | null>(null);

  readonly lastSavedLabel = computed(() => {
    const stamp = this.lastSavedAt();
    return stamp ? `Last saved ${formatStamp(stamp)}` : 'Not saved yet';
  });

  setMessage(message: string): void {
    this.message.set(message);
  }

  setLastSavedAt(iso: string | null): void {
    this.lastSavedAt.set(iso);
  }
}

function formatStamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

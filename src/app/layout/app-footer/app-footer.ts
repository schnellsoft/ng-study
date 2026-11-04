import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span>a001 layout</span>
      <span>Header · Sidebars · Main · Footer</span>
    </footer>
  `,
  styles: `
    :host {
      display: contents;
    }

    .footer {
      grid-area: footer;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1.5rem;
      border-top: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }
  `,
})
export class AppFooter {}

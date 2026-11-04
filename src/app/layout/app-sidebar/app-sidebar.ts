import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar" [class.sidebar-left]="side() === 'left'" [class.sidebar-right]="side() === 'right'" [attr.aria-label]="label()">
      <h2>{{ heading() }}</h2>
      <p>{{ body() }}</p>
    </aside>
  `,
  styles: `
    :host {
      display: contents;
    }

    .sidebar {
      padding: 1.25rem;
      background: var(--surface);
      border-color: var(--border);
      border-style: solid;
      overflow: auto;
    }

    .sidebar h2 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .sidebar p {
      margin: 0;
      line-height: 1.5;
      color: var(--muted);
    }

    .sidebar-left {
      grid-area: left;
      border-right-width: 1px;
    }

    .sidebar-right {
      grid-area: right;
      border-left-width: 1px;
    }

    @media (max-width: 900px) {
      .sidebar-left,
      .sidebar-right {
        border-width: 0;
        border-bottom: 1px solid var(--border);
      }
    }
  `,
})
export class AppSidebar {
  readonly side = input.required<'left' | 'right'>();
  readonly label = input.required<string>();
  readonly heading = input.required<string>();
  readonly body = input.required<string>();
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg class="icon" aria-hidden="true" focusable="false">
      <use [attr.href]="'/icons/sprite.svg#icon-' + name()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .icon {
      width: 1.15rem;
      height: 1.15rem;
      display: block;
    }
  `,
})
export class Icon {
  readonly name = input.required<string>();
}

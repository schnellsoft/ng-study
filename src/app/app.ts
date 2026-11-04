import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasWorkspace } from './canvas/canvas-workspace';
import { AppFooter } from './layout/app-footer/app-footer';
import { AppHeader } from './layout/app-header/app-header';
import { AppSidebar } from './layout/app-sidebar/app-sidebar';

@Component({
  imports: [RouterOutlet, AppHeader, AppSidebar, AppFooter, CanvasWorkspace],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = 'a001';
}

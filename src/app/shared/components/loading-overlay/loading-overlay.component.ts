import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
})
export class LoadingOverlayComponent {
  @Input() show = false;

  @Input() title = 'Loading...';
  @Input() message = 'Please wait a moment';

  @Input() zIndex = 'z-[9999]';
}

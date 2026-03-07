import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navigation-component',
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}

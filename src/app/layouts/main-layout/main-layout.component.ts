import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/side-bar/sidebar.component';
import { NavigationComponent } from '../../shared/components/nav/navigation.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, NavigationComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayout {}

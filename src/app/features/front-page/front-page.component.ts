import { Component, NgZone, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CountUpDirective } from '../../utils/count-up.directive';
import { AnnouncementItem, ANNOUNCEMENTS_MOCK } from '../../utils/sample.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-front-page-component',
  imports: [CountUpDirective, CommonModule],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {
  announcements = signal<AnnouncementItem[]>(ANNOUNCEMENTS_MOCK);
}

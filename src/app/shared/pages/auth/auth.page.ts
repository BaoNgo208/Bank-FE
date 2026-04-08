import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth.page.html',
})
export class AuthPage {
  hoverSide: 'left' | 'right' | null = null;
}

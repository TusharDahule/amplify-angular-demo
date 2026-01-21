import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { ToastComponent } from './shared/toast/toast.component';

import awsconfig from '../aws-exports';
import { LoaderComponent } from './shared/loader/loader.component';

Amplify.configure(awsconfig);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ToastComponent, LoaderComponent],
})
export class AppComponent {
  title = 'amplify-angular-template';
}

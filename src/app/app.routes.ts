import { Routes } from '@angular/router';
import { ContactDetailsComponent } from './contact/contact-details/contact-details.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'contact/:id',
    loadComponent: () =>
      import('./contact/contact-details/contact-details.component').then(
        (m) => m.ContactDetailsComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

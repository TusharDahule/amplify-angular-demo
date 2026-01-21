import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../../shared/contact.model';
import { contacts } from '../../shared/common.mock';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css',
})
export class ContactDetailsComponent implements OnInit, OnDestroy {
  contactDetails: Contact | undefined;
  subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    console.log('--------------contactDetails:');
    this.subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        console.log("params['id']: ", params['id']);
        this.contactService.getContactById(params['id']).then((data) => {
          this.contactDetails = JSON.parse(JSON.stringify(data));
        });
      }
    });
  }

  onBack(): void {
    this.router.navigateByUrl('home');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

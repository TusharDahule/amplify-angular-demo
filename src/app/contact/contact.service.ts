import { Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { contacts } from '../shared/common.mock';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts: Contact[] = contacts;

  constructor() {}

  getAllContacts(): Contact[] {
    return contacts.slice();
  }

  pushNewContact(contact: Contact): void {
    const contactObj: Contact = {
      id: this.contacts.length + 1,
      ...contact,
    };
    this.contacts.unshift(contactObj);
  }
}

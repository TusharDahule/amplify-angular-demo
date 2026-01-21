import { Injectable } from '@angular/core';
import { post, get } from 'aws-amplify/api';
import { LoaderService } from '../shared/loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiName = 'subscriber';
  private path = '/subscriber';

  constructor(private loaderService: LoaderService) {}

  async getAllContacts() {
    this.loaderService.show();
    const operation = get({
      apiName: this.apiName,
      path: this.path,
    });

    const response = await operation.response;
    this.loaderService.hide();
    return await response.body.json();
  }

  async createContact(payload: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    this.loaderService.show();
    const operation = post({
      apiName: this.apiName,
      path: this.path,
      options: {
        body: payload,
      },
    });

    const response = await operation.response;
    this.loaderService.hide();
    return await response.body.json();
  }

  async getContactById(id: string) {
    this.loaderService.show();
    const operation = get({
      apiName: this.apiName,
      path: this.path,
      options: {
        queryParams: { id },
      },
    });

    const response = await operation.response;
    this.loaderService.hide();
    return await response.body.json();
  }
}

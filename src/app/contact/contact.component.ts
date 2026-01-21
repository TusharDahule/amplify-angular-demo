import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { Contact } from '../shared/contact.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../shared/toast/toast.service';
import { ContactService } from './contact.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  totalContacts = 0;
  contacts: Contact[] = [];
  visibleContacts: Contact[] = [];
  currentPageNo = 1;
  totalPages = 0;
  pageSize = 5;
  tooltips: any[] = [];
  modalInstance: any;
  contactForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.setContactData();
  }

  setContactData(): void {
    // this.contacts = this.contactService.getAllMockContacts();
    this.contactService.getAllContacts().then((data) => {
      console.log('---contact data:', data);
      const parsedData = JSON.parse(JSON.stringify(data));
      console.log('parsedData: ', parsedData);
      this.contacts = parsedData;
      this.totalContacts = this.contacts.length;
      this.totalPages = this.getTotalPages();
      console.log('this.totalPages: ', this.totalPages);
      this.paginate(this.contacts, this.currentPageNo, this.pageSize);
    });
  }

  ngAfterViewInit() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((el) => {
      const tooltip = new bootstrap.Tooltip(el);
      this.tooltips.push(tooltip);
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalContacts / this.pageSize);
  }

  get paginatedData() {
    const start = (this.currentPageNo - 1) * this.pageSize;
    return this.contacts.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPageNo < this.totalPages) {
      this.currentPageNo++;
    }
  }

  prevPage() {
    if (this.currentPageNo > 1) {
      this.currentPageNo--;
    }
  }

  paginate(data: Contact[], currentPage: number, pageSize: number) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.visibleContacts = data.slice(startIndex, endIndex);
  }

  getPaginationPages(
    currentPage: number,
    totalPages: number,
    delta = 1
  ): number[] {
    const pages = [];
    const range = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    let prev;
    for (const page of range) {
      if (prev) {
        if (page - prev === 2) {
          pages.push(prev + 1);
        }
      }
      pages.push(page);
      prev = page;
    }
    return pages;
  }

  get pages() {
    return this.getPaginationPages(this.currentPageNo, this.totalPages);
  }

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageNo = page;
      this.paginate(this.contacts, this.currentPageNo, this.pageSize);
    }
  }

  onViewDetails(contact: Contact) {
    this.router.navigate(['contact', contact.id]);
  }

  onOpenCreateModal() {
    const modalEl = document.getElementById('contactModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
      modalEl.addEventListener(
        'hidden.bs.modal',
        () => {
          this.modalInstance?.dispose();
          this.modalInstance = null;
          this.contactForm.reset();
        },
        { once: true }
      );
      this.modalInstance.show();
    }
  }

  closeContactModal() {
    this.modalInstance?.hide();
    this.contactForm.reset();
  }

  handleSubmit(data: any) {
    console.log('Contact Data:', data);
    this.closeContactModal();
  }

  submit() {
    if (this.contactForm.valid) {
      console.log('Contact:', this.contactForm.value);
      this.contactService
        .createContact(this.contactForm.value)
        .then((response) => {
          this.toastService.show('Contact created successfully', 'success');
          this.setContactData();
        })
        .catch(() => {
          this.toastService.show('Something went wrong', 'error');
        });
      this.closeContactModal();
    }
  }

  get contactFormControls() {
    return this.contactForm.controls;
  }

  ngOnDestroy() {
    this.tooltips.forEach((tooltip) => tooltip.dispose());
    this.tooltips = [];
  }
}

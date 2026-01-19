import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from './toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit, OnDestroy {
  message = '';
  type: Toast['type'] = 'info';

  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toast$.subscribe((toast) => {
      this.message = toast.message;
      this.type = toast.type;
      this.showToast();
    });
  }

  showToast() {
    const toastEl = document.getElementById('appToast');
    if (toastEl) {
      toastEl.classList.remove('bg-success', 'bg-danger', 'bg-info');
      const bgClass =
        this.type === 'success'
          ? 'bg-success'
          : this.type === 'error'
          ? 'bg-danger'
          : 'bg-info';
      toastEl.classList.add(bgClass);
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

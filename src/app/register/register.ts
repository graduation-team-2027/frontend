import { UsersService, IUser } from '../services/users';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private userList = inject(UsersService);
  private router = inject(Router);
  user = { name: '', email: '', phone: '', password: '', confirmPassword: '' };
  registered = false;
  get passwordsDoNotMatch() {
    return !!(this.user.password && this.user.confirmPassword && this.user.password !== this.user.confirmPassword);
  }
  onSubmit(form: NgForm) {
    if (form.valid && !this.passwordsDoNotMatch) {
      this.userList.addUser({ ...this.user } as IUser);
      this.registered = true;
      form.resetForm();
      this.user = { name: '', email: '', phone: '', password: '', confirmPassword: '' };
    }
  }
}

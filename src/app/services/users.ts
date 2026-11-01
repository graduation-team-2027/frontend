import { Injectable } from '@angular/core';

interface ILog { email: string; password: string; }
export interface IUser { name: string; email: string; phone: string; password: string; confirmPassword?: string; }

@Injectable({ providedIn: 'root' })
export class UsersService {
  private users: IUser[] = [];
  constructor() {
    try {
      const data = localStorage.getItem('users');
      this.users = data ? JSON.parse(data) : [];
    } catch { this.users = []; }
  }
  addUser(user: IUser): void {
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  getUsers(): IUser[] { return this.users; }
  isExist(user: ILog): boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === user.email && this.users[i].password === user.password) return true;
    }
    return false;
  }
}

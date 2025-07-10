import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';


@Component({
  selector: 'app-username',
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() usernameSubmitted = new EventEmitter<string>();
  username: string = '';

  onSubmit() {
    if (this.username) {
      this.usernameSubmitted.emit(this.username);
    }
  }

  submitUsername() {
    if (this.username) {
      sessionStorage.setItem('chat-username', this.username); // Save to sessionStorage
      this.usernameSubmitted.emit(this.username);
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
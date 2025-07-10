import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../chat/chat/chat.component';
import { UsernameComponent } from '../chat/username/username.component';

@Component({
  selector: 'app-welcome',//defines the html tag for the component
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ChatComponent,
    UsernameComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {//starts the component class

  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  showUsername = false;
  showChat = false;

  openUsername() {
    if (!this.showUsername && !this.showChat) {
      this.showUsername = true;
    }
  }

  startChat(username: string) {
    this.showUsername = false;
    this.showChat = true;

    const finalUsername = username || sessionStorage.getItem('chat-username') || 'Guest';
    // Call the chat component and pass username if needed
    setTimeout(() => {
      if (this.chatComponent) {
        this.chatComponent.openChat(finalUsername);
      }
    });
  }

  closeUsername() {
    this.showUsername = false;
  }

  closeChat() {
    this.showChat = false;
    this.chatComponent.closeChat();
  }

  handleOverlayClick() {
    if (this.showChat) {
      this.closeChat();
    } else if (this.showUsername) {
      this.closeUsername();
    }
  }

  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/step1']);
  }
} 
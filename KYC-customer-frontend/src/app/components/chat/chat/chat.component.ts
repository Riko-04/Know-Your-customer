import {
  Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { ChatService, ChatMessage } from '../chat.service';
import { Observable } from 'rxjs';
import {
  trigger, style, animate, transition
} from '@angular/animations';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatTooltipModule
} from '@angular/material/tooltip';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  LucideHistory,
  LucideRefreshCw,
  LucideX
} from 'lucide-angular';
import {
  MatInputModule
} from '@angular/material/input';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  // animations: [
  //   trigger('chatPopup', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'scale(0.8)' }),
  //       animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  //     ]),
  //     transition(':leave', [
  //       animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
  //     ])
  //   ])
  // ]
})
export class ChatComponent implements OnInit, OnDestroy {
  @Output() closeRequested = new EventEmitter<void>();
  @ViewChild('messageArea') messageArea!: ElementRef;

  messages$: Observable<ChatMessage[]>;
  messageContent = '';
  showHistory = false;
  username = '';
  showWelcome = true;

  constructor(public chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }

  ngOnInit() {}

  openChat(username: string) {
    this.username = username;
    this.chatService.connect(username);
    this.showWelcome = true;
  }

  sendMessage() {
    if (!this.messageContent.trim()) return;

    const msg: ChatMessage = {
      sender: this.username,
      content: this.messageContent,
      type: 'CHAT'
    };

    this.chatService.sendMessage(msg);
    this.messageContent = '';
    this.showWelcome = false;

    setTimeout(() => {
      if (this.messageArea?.nativeElement) {
        this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
      }
    }, 100);
  }

  closeChat() {
    this.chatService.disconnect();
    this.closeRequested.emit();
  }

  startNewChat() {
    this.chatService.startNewSession();
    this.showWelcome = true;
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  loadSession(id: string) {
    this.chatService.loadSession(id);
    this.showHistory = false;
    this.showWelcome = false;
  }

  getAvatarUrl(sender: string): string {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${sender}`;
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  chatOpen = false;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }
}

import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  sender: string;
  content: string;
  type: string;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: Client | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private connected = false;

  private history: { [id: string]: ChatMessage[] } = {};
  private sessionId: string = '';

  connect(username: string) {
    if (this.connected) return;

    const socket = new SockJS('https://api.erickip.site/support/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        this.connected = true;

        this.sessionId = new Date().toISOString();
        this.history[this.sessionId] = [];

        this.stompClient?.subscribe('/topic/public', (message: IMessage) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          this.history[this.sessionId].push(chatMessage);

          const current = this.messagesSubject.getValue();
          this.messagesSubject.next([...current, chatMessage]);
        });

        this.stompClient!.publish({
          destination: '/app/chat.register',
          body: JSON.stringify({ sender: username, content: '', type: 'JOIN' })
        });
      },
      onStompError: err => console.error('WebSocket error:', err)
    });

    this.stompClient.activate();
  }

  sendMessage(msg: ChatMessage) {
    if (!msg.content.trim()) return;

    this.stompClient?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(msg)
    });

    this.addLocalMessage(msg); // Only the user's message
  }

  addLocalMessage(message: ChatMessage) {
    const messages = this.messagesSubject.getValue();
    this.messagesSubject.next([...messages, message]);

    if (this.sessionId) {
      this.history[this.sessionId].push(message);
    }
  }

  disconnect() {
    this.stompClient?.deactivate();
    this.connected = false;
  }

  getSessionIds(): string[] {
    return Object.keys(this.history);
  }

  loadSession(id: string) {
    this.sessionId = id;
    const messages = this.history[id] || [];
    this.messagesSubject.next([...messages]);
  }

  startNewSession() {
    this.sessionId = new Date().toISOString();
    this.history[this.sessionId] = [];
    this.messagesSubject.next([]);
  }
}

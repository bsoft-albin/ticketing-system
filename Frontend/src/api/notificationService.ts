import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';

class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private baseUrl = import.meta.env.VITE_HUB_URL || 'http://localhost:5000/hubs/notifications';

  async startConnection() {
    if (this.connection) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  onNotificationReceived(callback: (notification: any) => void) {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
    }
  }
}

export const notificationService = new NotificationService();

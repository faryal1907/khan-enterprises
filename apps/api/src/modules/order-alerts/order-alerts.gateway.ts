import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class OrderAlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      if (userId) {
        this.connectedClients.set(userId, client);
        client.join(`user:${userId}`);
        console.log(`User ${userId} connected to alerts`);
      }
    } catch (error) {
      console.error("WebSocket connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.connectedClients.entries()) {
      if (socket.id === client.id) {
        this.connectedClients.delete(userId);
        client.leave(`user:${userId}`);
        console.log(`User ${userId} disconnected from alerts`);
        break;
      }
    }
  }

  /**
   * Send alert to specific user
   */
  sendAlertToUser(userId: string, alert: any) {
    this.server.to(`user:${userId}`).emit("new_alert", alert);
  }

  /**
   * Broadcast alert to multiple users
   */
  sendAlertToUsers(userIds: string[], alert: any) {
    userIds.forEach((userId) => {
      this.sendAlertToUser(userId, alert);
    });
  }

  /**
   * Send unread count update to user
   */
  sendUnreadCountUpdate(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit("unread_count", { count });
  }

  @SubscribeMessage("mark_as_read")
  handleMarkAsRead(@ConnectedSocket() client: Socket, @MessageBody() data: { alertId: string }) {
    // This will be handled by the REST endpoint, but we can acknowledge the event
    client.emit("alert_marked_as_read", { alertId: data.alertId });
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit("pong", { timestamp: new Date() });
  }
}

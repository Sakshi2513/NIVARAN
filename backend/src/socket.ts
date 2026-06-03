import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

export let io: SocketIOServer;

interface UserPayload {
  userId: string;
  role: string;
}

export function initSocketServer(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: function (origin, callback) {
        callback(null, true);
      },
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication Error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as UserPayload;
      
      // Attach user info to socket
      (socket as any).user = decoded;
      next();
    } catch (err) {
      console.error('Socket Auth Error:', err);
      next(new Error('Authentication Error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as UserPayload;
    console.log(`[Socket] Client connected: ${user.userId} (${user.role})`);

    // Role-based Room Joining
    const role = user.role.toLowerCase();
    
    if (role === 'citizen') {
      socket.join(`citizen_${user.userId}`);
      console.log(`[Socket] Joined private room: citizen_${user.userId}`);
    } else if (role === 'officer' || role === 'departmenthead') {
      socket.join('officer_room');
      socket.join(`officer_${user.userId}`);
      console.log(`[Socket] Joined officer_room`);
    } else if (role === 'superadmin') {
      socket.join('superadmin_room');
      socket.join('officer_room'); // SuperAdmins might want to see officer activity too
      console.log(`[Socket] Joined superadmin_room`);
    }

    // Ping/Pong for latency tracking
    socket.on('ping', (cb) => {
      if (typeof cb === 'function') cb('pong');
    });

    // Real-Time Chat Routing
    socket.on('SEND_MESSAGE', (payload: { recipientId: string, text: string, complaintId: string }) => {
      // Broadcast to the specific recipient's room
      // Since citizens and officers have distinct private rooms `citizen_ID` and `officer_ID`, 
      // we can try sending to both if we don't know the role, or we can use the `emitToUser` helper pattern
      // We'll emit directly to the socket server instance
      console.log(`[Chat] ${user.userId} -> ${payload.recipientId}: ${payload.text}`);
      
      const messageData = {
        id: Math.random().toString(),
        senderId: user.userId,
        text: payload.text,
        complaintId: payload.complaintId,
        timestamp: new Date()
      };
      
      // Emit to the recipient
      io.to(`citizen_${payload.recipientId}`).emit('RECEIVE_MESSAGE', messageData);
      io.to(`officer_${payload.recipientId}`).emit('RECEIVE_MESSAGE', messageData);
      
      // Also echo back to sender to confirm (optional)
      socket.emit('MESSAGE_SENT_ACK', messageData);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${user.userId}`);
    });
  });

  return io;
}

// Helper to emit events safely from anywhere in the backend
export function emitToRole(roleRoom: string, eventName: string, data: any) {
  if (io) {
    io.to(roleRoom).emit(eventName, data);
  }
}

export function emitToUser(userId: string, eventName: string, data: any) {
  if (io) {
    // Check all possible specific rooms
    io.to(`citizen_${userId}`).emit(eventName, data);
    io.to(`officer_${userId}`).emit(eventName, data);
  }
}

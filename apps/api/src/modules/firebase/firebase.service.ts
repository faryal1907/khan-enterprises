import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      let privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      
      if (privateKey) {
        // Remove accidental extra quotes the user might have copied
        privateKey = privateKey.replace(/^"|"$/g, '');
        privateKey = privateKey.replace(/^'|'$/g, '');
        // Convert literal "\n" strings into actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      if (!projectId || !clientEmail || !privateKey) {
        this.logger.warn('Firebase configuration is incomplete. Push notifications will be disabled.');
        return;
      }

      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin SDK initialized successfully');
      } else {
        this.isInitialized = true;
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  async sendPushNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string[]> {
    if (!this.isInitialized) {
      this.logger.warn('Cannot send push notification because Firebase is not initialized');
      return [];
    }

    if (!tokens || tokens.length === 0) {
      return [];
    }

    const failedTokens: string[] = [];
    try {
      const message: MulticastMessage = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens,
      };

      const response = await getMessaging().sendEachForMulticast(message);
      
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            this.logger.error(`Failed to send notification to token ${tokens[idx]}: ${resp.error?.message}`);
          }
        });
      }
    } catch (error) {
      this.logger.error('Error sending push notification', error);
    }
    
    return failedTokens;
  }
}

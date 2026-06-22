import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterFcmTokenDto } from './dto/register-token.dto';

@Controller('firebase')
@UseGuards(JwtAuthGuard)
export class FirebaseController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('register-token')
  async registerToken(@Request() req, @Body() dto: RegisterFcmTokenDto) {
    const userId = req.user.id;

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Add token if it doesn't exist
    if (!user.fcmTokens.includes(dto.token)) {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          fcmTokens: {
            push: dto.token,
          },
        },
      });
    }

    return { success: true };
  }
}

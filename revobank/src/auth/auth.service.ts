import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    ) {}

    async login(data: any) {
        const user = await this.prisma.user.findUnique({
    where: { email: data.email },
    });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m', });

        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d', });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };

    }

    async register(data: any) {
        if (!data || !data.password) {
        throw new Error('Invalid request body');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
        });

            const { password, ...result } = user;

            return result;
    }

    async refresh(refreshToken: string) {
  try {
    const payload = await this.jwtService.verifyAsync(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new Error('Access Denied');
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    // 🔁 rotate tokens
    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefresh,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}
}
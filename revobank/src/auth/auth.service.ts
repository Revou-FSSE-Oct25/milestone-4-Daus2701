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

        const accessToken = this.jwtService.sign(payload);

        const { password, ...result } = user;

        return {
            user: result,
            accessToken,
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
}
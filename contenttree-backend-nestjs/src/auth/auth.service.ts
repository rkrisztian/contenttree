import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.strategy.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  async authenticate(username: string, password: string) {
    const user = await this.userRepo.findByName(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.jwt.signAsync({ sub: user.name, role: user.role } as JwtPayload);
  }
}

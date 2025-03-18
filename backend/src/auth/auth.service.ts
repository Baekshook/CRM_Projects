import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async findId(email: string, name: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.name !== name) {
      throw new UnauthorizedException(
        '일치하는 사용자 정보를 찾을 수 없습니다.',
      );
    }
    return { id: user.id };
  }

  async resetPassword(email: string, name: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.name !== name) {
      throw new UnauthorizedException(
        '일치하는 사용자 정보를 찾을 수 없습니다.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: hashedPassword });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}

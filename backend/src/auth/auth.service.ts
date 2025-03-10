import { Injectable, UnauthorizedException } from '@nestjs/common';

interface User {
  id: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthService {
  // 임시 사용자 데이터 (실제로는 데이터베이스를 사용해야 함)
  private users: User[] = [
    {
      id: 'test',
      password: '1234',
      name: '테스트 사용자',
    },
  ];

  async login({ id, password }: { id: string; password: string }) {
    // 실제 구현에서는 데이터베이스에서 사용자를 찾고 비밀번호를 검증해야 함
    const user = this.users.find((u) => u.id === id && u.password === password);

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성 및 반환 (실제 구현 필요)
    return {
      accessToken: 'dummy_token',
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  async register({
    id,
    password,
    name,
  }: {
    id: string;
    password: string;
    name: string;
  }) {
    // 실제 구현에서는 데이터베이스에 사용자 정보를 저장해야 함
    if (this.users.some((u) => u.id === id)) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다.');
    }

    const newUser: User = { id, password, name };
    this.users.push(newUser);

    return {
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        name: newUser.name,
      },
    };
  }
}

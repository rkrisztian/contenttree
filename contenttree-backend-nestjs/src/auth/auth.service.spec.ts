import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { Role } from './model/role.js';
import { User } from './model/user.entity.js';
import { UserRepository } from './user.repository.js';

const { compareMock } = vi.hoisted(() => ({
  compareMock: vi.fn<(data: string | Buffer, encrypted: string) => Promise<boolean>>(),
}));

vi.mock('bcrypt', () => ({
  compare: compareMock,
}));

/* oxlint-disable unbound-method */
describe('AuthService', () => {
  let service: AuthService;
  let userRepo: UserRepository;
  let jwtService: JwtService;

  const mockUser = new User('testUser', 'hashedPassword', Role.READER);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByName: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return token when credentials are valid', async () => {
    const username = 'testUser';
    const password = 'testPassword';
    const expectedToken = 'test-token';

    vi.mocked(userRepo.findByName).mockResolvedValue(mockUser);
    vi.mocked(compareMock).mockResolvedValue(true);
    vi.mocked(jwtService.signAsync).mockResolvedValue(expectedToken);

    const token = await service.authenticate(username, password);

    expect(token).toBe(expectedToken);
  });

  it('should throw when user not found', async () => {
    const username = 'testUser';
    const password = 'dummyPassword';

    vi.mocked(userRepo.findByName).mockResolvedValue(null);

    await expect(service.authenticate(username, password)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw when password is incorrect', async () => {
    const username = 'testUser';
    const wrongPassword = 'wrongPassword';

    vi.mocked(userRepo.findByName).mockResolvedValue(mockUser);
    vi.mocked(compareMock).mockResolvedValue(false);

    await expect(service.authenticate(username, wrongPassword)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

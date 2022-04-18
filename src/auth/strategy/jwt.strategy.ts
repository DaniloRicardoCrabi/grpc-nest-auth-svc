import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '../service/jwt.service';
import { PassportStrategy } from '@nestjs/passport';
import { Auth } from '../auth.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dev',
      ignoreExpiration: true,
    });
  }

  private validate(token: string): Promise<Auth | never> {
    return this.jwtService.validateUser(token);
  }
}

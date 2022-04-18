import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth.entity';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;
  private logger = new Logger('JwtService');

  private readonly jwt: Jwt;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }

  public async decode(token: string): Promise<unknown> {
    this.logger.log('Call JwtService method ' + this.decode.name);
    return this.jwt.decode(token, null);
  }

  public async validateUser(decode: any): Promise<Auth> {
    this.logger.log('Call JwtService method ' + this.validateUser.name);
    return await this.repository.findOne({
      where: { id: decode.id },
    });
  }

  public generateToken(auth: Auth): string {
    this.logger.log('Call JwtService method ' + this.generateToken.name);
    return this.jwt.sign({ id: auth.id, email: auth.email });
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    this.logger.log('Call JwtService method ' + this.isPasswordValid.name);
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    this.logger.log('Call JwtService method ' + this.encodePassword.name);
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public async verify(token: string): Promise<any> {
    this.logger.log('Call JwtService method ' + this.verify.name);
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }
}

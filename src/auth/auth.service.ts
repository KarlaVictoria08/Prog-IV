import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async registrar(email: string, senha: string): Promise<Usuario> {
    const hash = await bcrypt.hash(senha, 10);
    const usuario = this.usuarioRepository.create({ email, senha: hash });
    return await this.usuarioRepository.save(usuario);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ email: loginDto.email });
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');

    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Senha incorreta');

    const payload = { sub: usuario.id, email: usuario.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}

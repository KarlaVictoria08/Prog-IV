import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PessoaModule } from './pessoa/pessoa.module';
import { Pessoa } from './pessoa/pessoa.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './auth/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'banco.sqlite',
      entities: [Pessoa, Usuario], // <-- Adicionado o Usuario aqui
      synchronize: true,
    }),
    PessoaModule,
    AuthModule, // <-- Adicionado o AuthModule aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

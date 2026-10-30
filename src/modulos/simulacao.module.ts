import { SimulacoesController } from '../controller/simulacoes/simulacoesController';
import { SimulacoesService } from '../service/simulacoes/simulacoesService';
import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaService } from '../prisma/prisma.service';
import { SimulacoesRepository } from '../repository/simulacao/simulacaoRepository';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'refatorando_gate3_planilha_2',
    }),
  ],
  controllers: [SimulacoesController],
  providers: [SimulacoesService, PrismaService , SimulacoesRepository],
})
export class SimulacoesModule {}
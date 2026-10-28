import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { clientesController } from './controller/clientes/clientesController';
import { ClienteService } from './service/Clientes/clientesservice';

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
  controllers: [clientesController],
  providers: [ClienteService],
})
export class AppModule {}

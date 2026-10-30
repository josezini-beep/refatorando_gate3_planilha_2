import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

    type DadosCriacaoSimulacao = {
        uc: string;
        concessionaria: string;
        encargos: string;
        impostos: string;
        kwh: string;
        valor_kwh: string;
        desconto_percentual: string;
    };

@Injectable()
export class SimulacoesService {


    constructor(
        private readonly prisma: PrismaService
    ) {}

    async listarSimulacoes() {
        const resultado = await this.prisma.simulacoes.findMany({
            where: {
                apagado: false
            },
            orderBy: {
                id: 'asc'
            }
        });

        return resultado;
    }
    async buscarSimulacaoPorId(id: number) {
        const resultado = await this.prisma.simulacoes.findFirst({
            where: {
                id: id,
                apagado: false
            }
    });
    

    return resultado;
    
    }
        async buscarSimulacaoPorUC(uc: string) {
        const resultado = await this.prisma.simulacoes.findMany({
            where: {
                uc: uc,
                apagado: false
            }
    });
    
    return resultado;
    };
    
    async buscarSimulacaoPorCPF(cpf: string) {
        const resultado = await this.prisma.simulacoes.findMany({
            where: {
                cpf: cpf,
                apagado: false
            },
            orderBy: {
                id: 'asc'
            }
        });

        return resultado;
    }

    async criarSimulacao(dados: DadosCriacaoSimulacao) {
    const valorEnergia = new Prisma.Decimal(dados.kwh)
       .times(dados.valor_kwh);

    const economiaMensal = valorEnergia
        .times(dados.desconto_percentual)
        .dividedBy(100)
        .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    const economiaAnual = economiaMensal.times(12);

    if (economiaAnual.gt('9999999999.99')) {
        throw new BadRequestException(
            'Economia acima do limite permitido.'
        );
    }

        const simulacao = await this.prisma.simulacoes.create({
            data: {
                uc: dados.uc.trim(),
                concessionaria: dados.concessionaria.trim(),
                encargos: dados.encargos,
                impostos: dados.impostos,
                kwh: dados.kwh,
                valor_kwh: dados.valor_kwh,
                desconto_percentual: dados.desconto_percentual,
                economia_mensal: economiaMensal.toFixed(2),
                economia_anual: economiaAnual.toFixed(2)
            }
        })

        return simulacao;

    }
}
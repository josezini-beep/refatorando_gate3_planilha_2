import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from '../../generated/prisma/client';

    export type DadosCriacaoSimulacao = {
        uc: string;
        concessionaria: string;
        encargos: number;
        impostos: number;
        kwh: number;
        valor_kwh: number;
        desconto_percentual: number;
    };

@Injectable()
export class SimulacoesRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async listarSimulacoesRepository() {
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

    async buscaSimulacaoPorIdRepository(id: number) {
        const resultado = await this.prisma.simulacoes.findFirst({
            where: {
                id: id,
                apagado: false
            },
        });

        return resultado;

    }

        async buscaSimulacaoPorUCRepository(uc:string) {
        const resultado = await this.prisma.simulacoes.findMany({
            where: {
                uc: uc,
                apagado: false
            },
        });

        return resultado;

    }

        async buscaSimulacaoPorCPFRepository(cpf: string) {
            const resultado = await this.prisma.simulacoes.findMany({
                where: {
                    cpf: cpf,
                    apagado: false
                },
            });

            return resultado;

    }

        async criarSimulacaoRepository(dados: Prisma.simulacoesCreateInput) {

            const simulacao = await this.prisma.simulacoes.create({
                data: dados
            });

            return simulacao;
    }
        async deletarSimulacaoRepository(id: number) {
        const resultado = await this.prisma.simulacoes.update({
            data: {
                apagado: true
            },
            where: {
                id: id,
                apagado: false
            }
        });

        return resultado;
    }
}



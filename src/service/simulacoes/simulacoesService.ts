import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}
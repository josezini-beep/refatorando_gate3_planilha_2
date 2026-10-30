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
    
    async buscaSimulacaoPorIdRepository() {
        const resultado = await this.prisma.simulacoes.findFirst({
            where: {
                apagado: false
            },
        });

        return resultado;

    }

        async buscaSimulacaoPorUCRepository() {
        const resultado = await this.prisma.simulacoes.findFirst({
            where: {
                apagado: false
            },
        });

        return resultado;

    }

        async buscaSimulacaoPorCPFRepository() {
            const resultado = await this.prisma.simulacoes.findMany({
                where: {
                    apagado: false
                },
            });

            return resultado;

    }

        async criarSimulacaoRepository(dados: DadosCriacaoSimulacao) {
        validacoesDadosEntradaSimulacoes(dados);
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

function validacoesDadosEntradaSimulacoes(dados: DadosCriacaoSimulacao) {

    if (!dados || typeof dados !== 'object') {
        throw new BadRequestException('Dados inválidos.');
    }

    const {
        uc,
        concessionaria,
        encargos,
        impostos,
        kwh,
        valor_kwh,
        desconto_percentual
    } = dados;

    const valores = [
        encargos,
        impostos,
        kwh,
        valor_kwh,
        desconto_percentual
    ];

    // Validações de texto
    if (typeof uc !== 'string') {
        throw new BadRequestException('UC não é um texto');
    }

    if (uc.trim().length === 0) {
        throw new BadRequestException('UC não pode estar vazia!');
    }

    if (uc.length > 30) {
        throw new BadRequestException('UC Inválida');
    }

    if (typeof concessionaria !== 'string') {
        throw new BadRequestException('Concessionária Inválida');
    }

    if (concessionaria.trim().length === 0) {
        throw new BadRequestException('Concessionária não pode estar vazia');
    }

    // Validações numéricas
    if (!valores.every(
        valor => typeof valor === 'number' && Number.isFinite(valor)
    )) {
        throw new BadRequestException('Dados quantitativos incorretos');
    }

    if (
        encargos < 0 ||
        impostos < 0 ||
        kwh <= 0 ||
        valor_kwh <= 0 ||
        desconto_percentual < 0
    ) {
        throw new BadRequestException(
            'Dados quantitativos não podem ser negativos ou inválidos'
        );
    }

    if (desconto_percentual > 100) {
        throw new BadRequestException(
            'Desconto não pode ser maior que 100%'
        );
    }

    // Limites e casas decimais
    const limites = [
        { valor: encargos, casas: 2, maximo: '9999999999.99' },
        { valor: impostos, casas: 2, maximo: '9999999999.99' },
        { valor: kwh, casas: 3, maximo: '999999999.999' },
        { valor: valor_kwh, casas: 6, maximo: '999999.999999' },
        { valor: desconto_percentual, casas: 2, maximo: '100' }
    ];

    if (
        limites.some(({ valor, casas, maximo }) => {
            const decimal = new Prisma.Decimal(valor);

            return decimal.decimalPlaces() > casas ||
                   decimal.gt(maximo);
        })
    ) {
        throw new BadRequestException(
            'Valor acima do limite ou com casas decimais demais.'
        );
    }
}

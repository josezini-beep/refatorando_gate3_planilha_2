import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { SimulacoesRepository } from '../../repository/simulacao/simulacaoRepository'

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
export class SimulacoesService {


    constructor(
        private readonly prisma: PrismaService,
        private readonly simulacaoRepository: SimulacoesRepository
    ) {}

    async listarSimulacoes() {
        return this.simulacaoRepository.listarSimulacoesRepository();
    }
    
    async buscarSimulacaoPorId(id: number) {
        return this.simulacaoRepository.buscaSimulacaoPorIdRepository();    
    }
    async buscarSimulacaoPorUC(uc: string) {
        return this.simulacaoRepository.buscaSimulacaoPorUCRepository();    

    };
    
    async buscarSimulacaoPorCPF(cpf: string) {
        return this.simulacaoRepository.buscaSimulacaoPorCPFRepository();    
    }

    async criarSimulacao(dados: DadosCriacaoSimulacao) {
        return this.prisma.simulacoes.create({ data: dados });
    }
    
    async deletarSimulacao(id: number) {
        return this.simulacaoRepository.deletarSimulacaoRepository(id);  
    }
}

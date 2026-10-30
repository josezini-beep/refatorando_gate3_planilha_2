import { SimulacoesRepository } from '../../../src/repository/simulacao/simulacaoRepository';
import type { PrismaService } from '../../../src/prisma/prisma.service';

describe('SimulacoesRepository (com Prisma mockado)', () => {
    let repository: SimulacoesRepository;

    const findMany = jest.fn();
    const findFirst = jest.fn();
    const create = jest.fn();
    const update = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();

        const prismaMock = {
            simulacoes: { findMany, findFirst, create, update }
        } as unknown as PrismaService;

        repository = new SimulacoesRepository(prismaMock);
    });

    it('deve listar apenas simulações não apagadas ordenadas por ID', async () => {
        const simulacoes = [{ id: 1 }, { id: 2 }];
        findMany.mockResolvedValue(simulacoes);

        const resultado = await repository.listarSimulacoesRepository();

        expect(resultado).toEqual(simulacoes);
        expect(findMany).toHaveBeenCalledWith({
            where: { apagado: false },
            orderBy: { id: 'asc' }
        });
    });

    it('deve consultar uma simulação pelo ID e ignorar apagadas', async () => {
        const simulacao = { id: 15, apagado: false };
        findFirst.mockResolvedValue(simulacao);

        const resultado = await repository.buscaSimulacaoPorIdRepository(15);

        expect(resultado).toEqual(simulacao);
        expect(findFirst).toHaveBeenCalledWith({
            where: { id: 15, apagado: false }
        });
    });

    it('deve buscar várias simulações pela UC', async () => {
        const simulacoes = [{ id: 1, uc: '12345' }, { id: 2, uc: '12345' }];
        findMany.mockResolvedValue(simulacoes);

        const resultado = await repository.buscaSimulacaoPorUCRepository('12345');

        expect(resultado).toEqual(simulacoes);
        expect(findMany).toHaveBeenCalledWith({
            where: { uc: '12345', apagado: false },
            orderBy: { id: 'asc' }
        });
    });

    it('deve buscar simulações pelo CPF', async () => {
        const simulacoes = [{ id: 1, cpf: '12345678901' }];
        findMany.mockResolvedValue(simulacoes);

        const resultado = await repository.buscaSimulacaoPorCPFRepository('12345678901');

        expect(resultado).toEqual(simulacoes);
        expect(findMany).toHaveBeenCalledWith({
            where: { cpf: '12345678901', apagado: false }
        });
    });

    it('deve criar uma nova simulação com os dados calculados pelo Service', async () => {
        const dados = {
            uc: '12345',
            concessionaria: 'Copel',
            encargos: 50,
            impostos: 30,
            kwh: 500,
            valor_kwh: 0.8,
            desconto_percentual: 20,
            economia_mensal: '80.00',
            economia_anual: '960.00'
        };
        const simulacaoCriada = { id: 20, ...dados };
        create.mockResolvedValue(simulacaoCriada);

        const resultado = await repository.criarSimulacaoRepository(dados);

        expect(resultado).toEqual(simulacaoCriada);
        expect(create).toHaveBeenCalledWith({ data: dados });
        expect(update).not.toHaveBeenCalled();
    });

    it('deve realizar a exclusão lógica de uma simulação', async () => {
        const simulacaoApagada = { id: 7, apagado: true };
        update.mockResolvedValue(simulacaoApagada);

        const resultado = await repository.deletarSimulacaoRepository(7);

        expect(resultado).toEqual(simulacaoApagada);
        expect(update).toHaveBeenCalledWith({
            data: { apagado: true },
            where: { id: 7, apagado: false }
        });
    });
});

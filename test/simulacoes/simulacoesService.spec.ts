import { SimulacoesService } from '../../src/service/simulacoes/simulacoesService';
import type { PrismaService } from '../../src/prisma/prisma.service';

describe('SimulacoesService', () => {

    it('deve listar as simulações não apagadas', async () => {

        const simulacoes = [
            {
                id: 1,
                uc: '12345',
                apagado: false
            },
            {
                id: 3,
                uc: '12345',
                apagado: false
            }
        ];

        const findMany = jest.fn().mockResolvedValue(simulacoes);

        const prismaMock = {
            simulacoes: {
                findMany
            }
        } as unknown as PrismaService;

        const service = new SimulacoesService(prismaMock);

        const resultado = await service.listarSimulacoes();

        expect(resultado).toEqual(simulacoes);

        expect(findMany).toHaveBeenCalledWith({
            where: {
                apagado: false
            },
            orderBy: {
                id: 'asc'
            }
        });

    });
    it('deve buscar uma simulação pelo ID', async () => {

        const simulacao = {
            id: 1,
            uc: '12345',
            apagado: false
        };

        const findFirst = jest.fn().mockResolvedValue(simulacao);

        const prismaMock = {
            simulacoes: {
                findFirst
            }
        } as unknown as PrismaService;

        const service = new SimulacoesService(prismaMock);

        const resultado = await service.buscarSimulacaoPorId(1);

        expect(resultado).toEqual(simulacao);

        expect(findFirst).toHaveBeenCalledWith({
            where: {
                id: 1,
                apagado: false
            }
        });

    });
    it('deve retornar null quando a simulação não existir', async () => {

        const findFirst = jest.fn().mockResolvedValue(null);

        const prismaMock = {
            simulacoes: {
                findFirst
            }
        } as unknown as PrismaService;

        const service = new SimulacoesService(prismaMock);

        const resultado = await service.buscarSimulacaoPorId(999);

        expect(resultado).toBeNull();

        expect(findFirst).toHaveBeenCalledWith({
            where: {
                id: 999,
                apagado: false
            }
        });

    });

    it('deve buscar simulações pelo CPF', async () => {

        const simulacoes = [
            {
                id: 1,
                cpf: '12345678901',
                apagado: false
            },
            {
                id: 2,
                cpf: '12345678901',
                apagado: false
            }
        ];

        const findMany = jest.fn().mockResolvedValue(simulacoes);

        const prismaMock = {
            simulacoes: {
                findMany
            }
        } as unknown as PrismaService;

        const service = new SimulacoesService(prismaMock);

        const resultado = await service.buscarSimulacaoPorCPF('12345678901');

        expect(resultado).toEqual(simulacoes);

        expect(findMany).toHaveBeenCalledWith({
            where: {
                cpf: '12345678901',
                apagado: false
            },
            orderBy: {
                id: 'asc'
            }
        });

    });

    it('deve retornar um array vazio quando o CPF não existir', async () => {

        const findMany = jest.fn().mockResolvedValue([]);

        const prismaMock = {
            simulacoes: {
                findMany
            }
        } as unknown as PrismaService;

        const service = new SimulacoesService(prismaMock);

        const resultado = await service.buscarSimulacaoPorCPF('99999999999');

        expect(resultado).toEqual([]);

        expect(findMany).toHaveBeenCalledWith({
            where: {
                cpf: '99999999999',
                apagado: false
            },
            orderBy: {
                id: 'asc'
            }
        });

    });
});
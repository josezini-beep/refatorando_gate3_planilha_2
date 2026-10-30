import { SimulacoesController } from '../../../src/controller/simulacoes/simulacoesController';
import type { SimulacoesService } from '../../../src/service/simulacoes/simulacoesService';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SimulacoesController', () => {
    it('deve lançar erro 400 quando o ID for inválido', async () => {

        const buscarSimulacaoPorId = jest.fn();

        const serviceMock = {
            buscarSimulacaoPorId
        } as unknown as SimulacoesService;

        const controller = new SimulacoesController(serviceMock);

        await expect(
            controller.buscarSimulacaoPorId(-1)
        ).rejects.toThrow(BadRequestException);

        expect(buscarSimulacaoPorId).not.toHaveBeenCalled();

    });

    it('deve retornar a lista de simulações', async () => {

        const simulacoes = [
            { id: 1, uc: '12345', apagado: false },
            { id: 2, uc: '67890', apagado: false }
        ];

        const listarSimulacoes = jest.fn().mockResolvedValue(simulacoes);

        const serviceMock = {
            listarSimulacoes
        } as unknown as SimulacoesService;

        const controller = new SimulacoesController(serviceMock);

        const resultado = await controller.listarSimulacoes();

        expect(resultado).toEqual(simulacoes);

        expect(listarSimulacoes).toHaveBeenCalledTimes(1);

    });

    it('deve retornar uma simulação pelo ID', async () => {

        const simulacao = {
            id: 1,
            uc: '12345',
            apagado: false
        };

        const buscarSimulacaoPorId = jest.fn().mockResolvedValue(simulacao);

        const serviceMock = {
            buscarSimulacaoPorId
        } as unknown as SimulacoesService;

        const controller = new SimulacoesController(serviceMock);

        const resultado = await controller.buscarSimulacaoPorId(1);

        expect(resultado).toEqual(simulacao);

        expect(buscarSimulacaoPorId).toHaveBeenCalledWith(1);

    });
    it('deve lançar erro 404 quando a simulação não existir', async () => {

        const buscarSimulacaoPorId = jest.fn().mockResolvedValue(null);

        const serviceMock = {
            buscarSimulacaoPorId
        } as unknown as SimulacoesService;

        const controller = new SimulacoesController(serviceMock);

        await expect(
            controller.buscarSimulacaoPorId(999)
        ).rejects.toThrow(NotFoundException);

        expect(buscarSimulacaoPorId).toHaveBeenCalledWith(999);

    });


});
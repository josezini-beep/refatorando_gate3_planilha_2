import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SimulacoesController } from '../../src/controller/simulacoes/simulacoesController';
import { SimulacoesService } from '../../src/service/simulacoes/simulacoesService';

describe('Rotas HTTP de simulações', () => {

    let app: INestApplication;

    const serviceMock = {
        listarSimulacoes: jest.fn(),
        buscarSimulacaoPorId: jest.fn(),
        buscarSimulacaoPorUC: jest.fn(),
        buscarSimulacaoPorCPF: jest.fn()
    };

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [SimulacoesController],
            providers: [
                {
                    provide: SimulacoesService,
                    useValue: serviceMock
                }
            ]
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /simulacoes deve retornar status 200', async () => {

        const simulacoes = [
            { id: 1, uc: '12345', apagado: false },
            { id: 2, uc: '67890', apagado: false }
        ];

        serviceMock.listarSimulacoes.mockResolvedValue(simulacoes);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes');

        expect(resposta.status).toBe(200);

        expect(resposta.body).toEqual(simulacoes);

        expect(serviceMock.listarSimulacoes).toHaveBeenCalledTimes(1);
    });
    it('GET /simulacoes/uc/:uc deve retornar status 200', async () => {

        const simulacoes = [
            { id: 1, uc: '12345', apagado: false },
            { id: 2, uc: '12345', apagado: false }
        ];

        serviceMock.buscarSimulacaoPorUC.mockResolvedValue(simulacoes);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes/uc/12345');

        expect(resposta.status).toBe(200);

        expect(resposta.body).toEqual(simulacoes);

        expect(serviceMock.buscarSimulacaoPorUC)
            .toHaveBeenCalledWith('12345');
    });

    it('GET /simulacoes/uc/:uc deve retornar 404 quando a UC não existir', async () => {

        serviceMock.buscarSimulacaoPorUC.mockResolvedValue([]);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes/uc/99999');

        expect(resposta.status).toBe(404);

        expect(resposta.body.message).toBe('UC não encontrada.');

        expect(serviceMock.buscarSimulacaoPorUC)
            .toHaveBeenCalledWith('99999');
    });

    it('deve retornar 404 quando a UC não existir', async () => {

        serviceMock.buscarSimulacaoPorUC.mockResolvedValue([]);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes/uc/99999');

        expect(resposta.status).toBe(404);

        expect(resposta.body.message).toBe('UC não encontrada.');

        expect(serviceMock.buscarSimulacaoPorUC)
            .toHaveBeenCalledWith('99999');

    });
    it('GET /simulacoes/cpf/:cpf deve retornar 200 quando o CPF existir', async () => {

        const simulacoes = [
            { id: 1, cpf: '12345678901', apagado: false },
            { id: 2, cpf: '12345678901', apagado: false }
        ];

        serviceMock.buscarSimulacaoPorCPF.mockResolvedValue(simulacoes);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes/cpf/12345678901');

        expect(resposta.status).toBe(200);
        expect(resposta.body).toEqual(simulacoes);

        expect(serviceMock.buscarSimulacaoPorCPF)
            .toHaveBeenCalledWith('12345678901');

    });

    it('GET /simulacoes/cpf/:cpf deve retornar 404 quando o CPF não existir', async () => {

        serviceMock.buscarSimulacaoPorCPF.mockResolvedValue([]);

        const resposta = await request(app.getHttpServer())
            .get('/simulacoes/cpf/99999999999');

        expect(resposta.status).toBe(404);

        expect(resposta.body.message).toBe('CPF não encontrado.');

        expect(serviceMock.buscarSimulacaoPorCPF)
            .toHaveBeenCalledWith('99999999999');

    });
    
});
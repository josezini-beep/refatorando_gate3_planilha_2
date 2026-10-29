import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { SimulacoesController } from '../../src/controller/simulacoes/simulacoesController';
import { SimulacoesService } from '../../src/service/simulacoes/simulacoesService';

describe('Rotas HTTP de simulações', () => {

    let app: INestApplication;

    const serviceMock = {
        listarSimulacoes: jest.fn(),
        buscarSimulacaoPorId: jest.fn()
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
    
});
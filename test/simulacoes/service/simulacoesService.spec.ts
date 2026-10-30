import { BadRequestException } from '@nestjs/common';
import { SimulacoesService } from '../../../src/service/simulacoes/simulacoesService';
import { SimulacoesRepository } from '../../../src/repository/simulacao/simulacaoRepository';

describe('SimulacoesService', () => {

    let service: SimulacoesService;

    const repositoryMock = {
        listarSimulacoesRepository: jest.fn(),
        buscaSimulacaoPorIdRepository: jest.fn(),
        buscaSimulacaoPorUCRepository: jest.fn(),
        buscaSimulacaoPorCPFRepository: jest.fn(),
        criarSimulacaoRepository: jest.fn(),
        deletarSimulacaoRepository: jest.fn()
    };

    beforeEach(() => {

        jest.resetAllMocks();

        service = new SimulacoesService(
            undefined as never,
            repositoryMock as unknown as SimulacoesRepository
        );

    });

    // Seus testes it() continuam abaixo
    it('deve retornar [] quando a UC não existir', async () => {
        repositoryMock.buscaSimulacaoPorUCRepository.mockResolvedValue([]);

        const resultado = await service.buscarSimulacaoPorUC('99999');

        expect(resultado).toEqual([]);
        expect(repositoryMock.buscaSimulacaoPorUCRepository).toHaveBeenCalledWith('99999');
    });

    it('deve buscar simulações pelo CPF', async () => {
        const simulacoes = [{ id: 1, cpf: '12345678901' }, { id: 2, cpf: '12345678901' }];
        repositoryMock.buscaSimulacaoPorCPFRepository.mockResolvedValue(simulacoes);

        const resultado = await service.buscarSimulacaoPorCPF('12345678901');

        expect(resultado).toEqual(simulacoes);
        expect(repositoryMock.buscaSimulacaoPorCPFRepository).toHaveBeenCalledWith('12345678901');
    });

    it('deve retornar [] quando o CPF não existir', async () => {
        repositoryMock.buscaSimulacaoPorCPFRepository.mockResolvedValue([]);

        const resultado = await service.buscarSimulacaoPorCPF('99999999999');

        expect(resultado).toEqual([]);
        expect(repositoryMock.buscaSimulacaoPorCPFRepository).toHaveBeenCalledWith('99999999999');
    });

    const dadosValidos = {
        uc: ' 12345 ',
        concessionaria: ' Copel ',
        encargos: 50,
        impostos: 30,
        kwh: 500,
        valor_kwh: 0.8,
        desconto_percentual: 20
    };

    it('deve calcular as economias e enviar os dados ao Repository', async () => {
        const simulacaoCriada = { id: 10, uc: '12345' };
        repositoryMock.criarSimulacaoRepository.mockResolvedValue(simulacaoCriada);

        const resultado = await service.criarSimulacao(dadosValidos);

        expect(resultado).toEqual(simulacaoCriada);
        expect(repositoryMock.criarSimulacaoRepository).toHaveBeenCalledWith({
            uc: '12345',
            concessionaria: 'Copel',
            encargos: 50,
            impostos: 30,
            kwh: 500,
            valor_kwh: 0.8,
            desconto_percentual: 20,
            economia_mensal: '80.00',
            economia_anual: '960.00'
        });
    });

    it('deve arredondar a economia mensal para cima em empate decimal', async () => {
        repositoryMock.criarSimulacaoRepository.mockResolvedValue({ id: 11 });

        await service.criarSimulacao({
            ...dadosValidos,
            kwh: 1,
            valor_kwh: 0.05,
            desconto_percentual: 10
        });

        expect(repositoryMock.criarSimulacaoRepository).toHaveBeenCalledWith(
            expect.objectContaining({
                economia_mensal: '0.01',
                economia_anual: '0.12'
            })
        );
    });

    it('deve rejeitar consumo negativo antes de chamar o Repository', async () => {
        await expect(
            service.criarSimulacao({ ...dadosValidos, kwh: -10 })
        ).rejects.toThrow(BadRequestException);

        expect(repositoryMock.criarSimulacaoRepository).not.toHaveBeenCalled();
    });

    it('deve rejeitar desconto superior a 100%', async () => {
        await expect(
            service.criarSimulacao({ ...dadosValidos, desconto_percentual: 101 })
        ).rejects.toThrow('Desconto não pode ser maior que 100%');

        expect(repositoryMock.criarSimulacaoRepository).not.toHaveBeenCalled();
    });

    it('deve rejeitar excesso de casas decimais', async () => {
        await expect(
            service.criarSimulacao({ ...dadosValidos, kwh: 1.1234 })
        ).rejects.toThrow('Valor acima do limite ou com casas decimais demais.');

        expect(repositoryMock.criarSimulacaoRepository).not.toHaveBeenCalled();
    });

    it('deve rejeitar economia anual acima do limite', async () => {
        await expect(
            service.criarSimulacao({
                ...dadosValidos,
                kwh: 100_000_000,
                valor_kwh: 20,
                desconto_percentual: 100
            })
        ).rejects.toThrow('Economia acima do limite permitido.');

        expect(repositoryMock.criarSimulacaoRepository).not.toHaveBeenCalled();
    });

    it('deve encaminhar a exclusão lógica ao Repository', async () => {
        const simulacaoApagada = { id: 3, apagado: true };
        repositoryMock.deletarSimulacaoRepository.mockResolvedValue(simulacaoApagada);

        const resultado = await service.deletarSimulacao(3);

        expect(resultado).toEqual(simulacaoApagada);
        expect(repositoryMock.deletarSimulacaoRepository).toHaveBeenCalledWith(3);
    });
});

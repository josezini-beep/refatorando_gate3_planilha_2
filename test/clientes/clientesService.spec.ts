import { ClienteService } from '../../src/service/Clientes/clientesService';

describe('ClienteService', () => {

    it('deve executar a importação de clientes', async () => {

        const service = new ClienteService();

        const resultado = await service.importarClientes();

        expect(resultado).toEqual({
            mensagem: 'Service funcionando'
        });

    });
    

});


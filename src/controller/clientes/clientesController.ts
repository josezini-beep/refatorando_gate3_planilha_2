import { Controller, Post } from '@nestjs/common';
import { ClienteService } from '../../service/Clientes/clientesService';

@Controller('clientes')

export class clientesController {

    constructor(
        private readonly clientesService: ClienteService
    ) {}

    @Post('importar')
    async importarClientes() {
        return {
            mensagem: 'Rota de importação funcionando!'
        };
    }
}
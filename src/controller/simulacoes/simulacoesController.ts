import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';

import { SimulacoesService } from '../../service/simulacoes/simulacoesService';

@Controller('simulacoes')
export class SimulacoesController {

    constructor(
        private readonly simulacoesService: SimulacoesService
    ) {}

    @Get()
    async listarSimulacoes() {
        return this.simulacoesService.listarSimulacoes();
    }

    @Get(':id')
    async buscarSimulacaoPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        if (id <= 0) {
            throw new BadRequestException('ID inválido.');
        }

        const resultado =
            await this.simulacoesService.buscarSimulacaoPorId(id);

        if (!resultado) {
            throw new NotFoundException('Simulação não encontrada.');
        }

        return resultado;
    }
}
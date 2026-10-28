import { Injectable } from "@nestjs/common";

@Injectable()
export class ClienteService{

    async importarClientes(){
        return {
            mensagem:"Service funcionando"
        }
    }
}
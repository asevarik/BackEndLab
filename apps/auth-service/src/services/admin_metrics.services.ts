import {Response} from 'express';

export enum SSEEventType{
    USER_REGISTERED = 'USER_REGISTERED',
    USER_SIGNED_IN = 'USER_SIGNED_IN',
}


export class SSEStore{
    private clients: Map<string, Response> = new Map();
    
    addClient(id:string,res:Response):void{
        this.clients.set(id,res);
    }
    removeClient(id:string):void{
        this.clients.delete(id);
    }
    broadcast(data:any,eventType:SSEEventType){
        const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        for(const[,res] of this.clients){
            res.write(payload);
        }
    }
    count():number{
       return this.clients.size;
    }
    getClients():string[]{
        return Array.from(this.clients.keys())
    }

    clear():void{
        this.clients.clear();
    }
}

//Singleton instance of SSEStore
export const sseStore = new SSEStore();

import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../../../gRPC/control'
import { variables } from '../../init'
import { Req } from '../../../gRPC/control/Req'
import { Res } from '../../../gRPC/control/Res'
import { logger } from '../logger/logger.service'

export class AbaControlClient {

    private call: any

    constructor(options?: protoLoader.Options) {
        const CONTROL_PROTO_PATH = '../../../../gRPC/control.proto'
        const packageDef = protoLoader.loadSync(
            path.resolve(__dirname, CONTROL_PROTO_PATH),
            options
        )

        const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType

        const client = new grpcObj.control.Control(
            `${variables.get("ABA_CONTROL_IP")}:${variables.get("ABA_CONTROL_PORT")}`,
            grpc.credentials.createInsecure()
        )

        const meta = new grpc.Metadata()
        meta.add('id', (Math.floor(Math.random() * 10000) + 1).toString())

        this.call = client.streamApi(meta)
    }

    sendMsg(msg: Req) {
        logger.info("отправляем сообщение")
        this.call.write(msg)
    }

    endStream() {
        logger.info("закрываем стрим")
        this.call.end()
    }

    async listen(): Promise<string> {
        return new Promise((resolve) => {
            logger.info("Ждем команду от сервера")
            this.call.on('data', async (response: Res) => {
                logger.info(response)
                if(!response.msg) {
                    throw new Error("Отсутствует поле msg")
                }
                logger.info("Пришла!")
                resolve(response.msg)
            })
        })
    }    
}
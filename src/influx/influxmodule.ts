import { DynamicModule, Module, Provider } from "@nestjs/common";
import { InfluxConnectionConstant } from "./constant/influx-connection.constant";
import { InfluxOptionsInterface } from "./interfaces/influx.options";
import { InfluxDB } from '@influxdata/influxdb-client'
import { RegisteredInflux } from "./interfaces/registered.influx";
import { InfluxService } from "./services/influx.service";

@Module({})
export class InfluxModule {
    static forRoot(options: InfluxOptionsInterface): DynamicModule {
        const connectionProvider: Provider = {
            provide: InfluxConnectionConstant,
            useFactory: () => {
                const registeredInflux: RegisteredInflux = {
                    influx: new InfluxDB({ url: options.url, token: options.token }),
                    options: { bucket: options.bucket, organization: options.organization }
                }
                return registeredInflux
            }
        }

        const influxDynamicModule: DynamicModule = {
            module: InfluxModule,
            providers: [connectionProvider, InfluxService],
            exports: [InfluxService],
            global: true
        }

        return influxDynamicModule
    }
}
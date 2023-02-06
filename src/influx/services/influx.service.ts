import { Point, QueryApi, WriteApi } from "@influxdata/influxdb-client";
import { Inject, Injectable } from "@nestjs/common";
import { InfluxConnectionConstant } from "../constant/influx-connection.constant";
import { RegisteredInflux } from "../interfaces/registered.influx";
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Subject } from "rxjs";

@Injectable()
export class InfluxService {
    readApi: QueryApi;
    priceData: Subject<any[]> = new Subject();
    constructor(@Inject(InfluxConnectionConstant) private registeredInflux: RegisteredInflux) {
        this.readApi = registeredInflux.influx.getQueryApi(registeredInflux.options.organization)
    }

    writePrice(exchange: string, price: number) {
        const writeApi: WriteApi = this.registeredInflux.influx.getWriteApi(this.registeredInflux.options.organization, this.registeredInflux.options.bucket)
        const point = new Point(uuidv4())
            .tag("Exchange", exchange)
            .floatField("price", price)
        writeApi.writePoint(point)
        writeApi.close().then(() => {
            console.log('WRITE FINISHED')
        })
    }

    readPrice(bucket: string, exchange: string, startRange: number, endRange: number) {
        const queryApi = this.registeredInflux.influx.getQueryApi(this.registeredInflux.options.organization)
        let data = []
        // |> range(start: "${startRange}", stop: "${endRange}")
        // |> filter(fn: (r) => r._measurement == "${measurement}"
        const fluxQuery = `from(bucket:"${'mamad3'}") |> range(start: 0) |> filter(fn: (r) => r.Exchange == "${'BTC_USDT'}")`
        const ctx = this
        const fluxObserver = {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                data.push(o)
            },
            error(error) {
                console.error(error)
                console.log('\nFinished ERROR')
            },
            complete() {
                console.log('\nFinished SUCCESS')
                ctx.priceData.next(data)
            }
        }
        queryApi.queryRows(fluxQuery, fluxObserver)
        // return data
    }
}
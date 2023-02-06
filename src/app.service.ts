import { Injectable, OnModuleInit } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { InfluxService } from './influx/services/influx.service';
import { observable } from 'rxjs';
import { resolve } from 'path';

@Injectable()
export class AppService {
  constructor(private influxService: InfluxService) {
    // this.writePrice()
    this.readPrice().then(res => {
      console.log(res.length);
    })

  }
  getHello(): string {
    return 'Hello World!';
  }


  // testWrite() {
  //   /**
  //    * Create a write client from the getWriteApi method.
  //    * Provide your `org` and `bucket`.
  //    **/
  //   const writeApi = this.influxDB.getWriteApi(this.org, this.bucket)

  //   /**
  //    * Apply default tags to all points.
  //    **/
  //   // writeApi.useDefaultTags({ region: 'west' })

  //   /**
  //    * Create a point and write it to the buffer.
  //    **/
  //   for (let index = 0; index < 1000; index++) {
  //     const point1 = new Point(`price_${index}`)
  //       // .tag('sensor_id', `TLM_${index}`)
  //       .floatField('price', index)
  //     // .stringField('mamad', 5)
  //     console.log(point1)
  //     writeApi.writePoint(point1)
  //   }


  //   /**
  //    * Flush pending writes and close writeApi.
  //    **/
  //   writeApi.close().then(() => {
  //     console.log('WRITE FINISHED')
  //     // this.testRead()
  //   })
  // }

  // testRead() {
  //   const queryApi = this.influxDB.getQueryApi(this.org)

  //   /** To avoid SQL injection, use a string literal for the query. */
  //   const fluxQuery = 'from(bucket:"mamad") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")'

  //   const fluxObserver = {
  //     next(row, tableMeta) {
  //       const o = tableMeta.toObject(row)
  //       console.log(
  //         o
  //       )
  //     },
  //     error(error) {
  //       console.error(error)
  //       console.log('\nFinished ERROR')
  //     },
  //     complete() {
  //       console.log('\nFinished SUCCESS')
  //     }
  //   }

  //   /** Execute a query and receive line table metadata and rows. */
  //   queryApi.queryRows(fluxQuery, fluxObserver)
  // }

  writePrice() {
    for (let index = 0; index < 1000; index++) {
      this.influxService.writePrice(`BTC_USDT`, 1000)
    }
  }

  readPrice(): Promise<any[]> {
    const ctx = this;
    return new Promise((resolve, reject) => {
      const endRange = new Date("2023-02-05T10:23:04.427Z").getTime()
      this.influxService.readPrice("mamad3", "BTC_USDT", 0, endRange)
      ctx.influxService.priceData.subscribe(res => {
        console.log("subscribe", res.length);

        if (res.length > 0)
          resolve(Array.from(res))
      })
    })


  }
}

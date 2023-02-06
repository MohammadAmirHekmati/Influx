import { InfluxDB } from "@influxdata/influxdb-client";
import { Bucket } from "@influxdata/influxdb-client-apis";

export interface Options {
    bucket: string
    organization: string
}

export interface RegisteredInflux {
    influx: InfluxDB
    options: Options
}
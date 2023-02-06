import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configs } from './configs';
import { InfluxModule } from './influx/influxmodule';

@Module({
  imports: [InfluxModule.forRoot(Configs.influx)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

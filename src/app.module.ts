import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://client:Welcome123@cluster0.40etm.mongodb.net/DB-1?retryWrites=true&w=majority'), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

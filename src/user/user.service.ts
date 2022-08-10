import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async get() {
        let data = await this.userModel.find()
        return data
    }

    async register(body: any): Promise<any> {
        return await this.userModel.create(body)
    }

    async login(condition: any): Promise<any> {
        return await this.userModel.findOne(condition)
    }
}

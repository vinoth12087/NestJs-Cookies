import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, response, Response } from 'express';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }
    @Get('')
    async getUser(@Res() response: Response) {
        const data = await this.userService.get()
        response.status(200).send(data)
    }

    @Post('register')
    async register(@Body() body: any): Promise<any> {
        const saltOrRounds = 12;
        const hash = await bcrypt.hash(body.password, saltOrRounds);
        return this.userService.register({
            fullname: body.fullname,
            email: body.email,
            password: hash
        })
    }

    @Post('login')
    async login(@Body() body: any, @Res() response: Response): Promise<any> {
        const user = await this.userService.login({ email: body.email })
        if (!user) {
            throw new BadRequestException("Invalid Credentials")
        }

        if (!await bcrypt.compare(body.password, user.password)) {
            throw new BadRequestException("Invalid Credentials")
        }

        const token = await this.jwtService.signAsync({ id: user?._id })

        // 3600 * 1000  ====> 1 hour
        response.
            status(200).
            cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 3600 * 1000) }).
            send({ message: 'success' })
    }

    @Get('get')
    async get(@Req() req: Request): Promise<any> {
        try {
            const cookie = req.cookies['token']
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data) {
                throw new UnauthorizedException()
            }
            const user = await this.userService.login({ _id: data?.id })
            const { password, ...result } = user._doc
            return { message: 'success', data: result }
        } catch (e) {
            throw new UnauthorizedException()
        }

    }

    @Post('logout')
    logout(@Res() response: Response) {
        response.clearCookie('token')
        response.send({ message: 'success' })
    }
}

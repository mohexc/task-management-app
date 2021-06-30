import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto, JwtPayload } from './auth.dto';
import { UsersRepository } from './user.repository';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredintialsDto: AuthCredentialsDto): Promise<string> {
        return this.usersRepository.createUser(authCredintialsDto)
    }

    async signIn(authCredintialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredintialsDto
        const user = await this.usersRepository.findOne({ username })

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username }
            const accessToken: string = await this.jwtService.sign(payload)
            return { accessToken }
        }
        throw new UnauthorizedException('Please check your login credentials')
    }
}

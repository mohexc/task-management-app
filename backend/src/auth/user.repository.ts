import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./auth.dto";
import { User } from "./user.entity";
import { genSalt, hash } from 'bcrypt'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredintialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredintialsDto
        const salt = await genSalt()
        const hashedPassword = await hash(password, salt)
        const user = this.create({ username, password: hashedPassword })

        try {
            await this.save(user)
            return 'created user sucsses'
        } catch (error) {
            if (error.code === '23505') {// duplicate username
                throw new ConflictException('Username already exists')
            }
            throw new InternalServerErrorException()
        }
    }
}
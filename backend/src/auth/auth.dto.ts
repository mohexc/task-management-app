import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDto {
    @MinLength(4)
    @MaxLength(20)
    @IsString()
    username: string

    @MinLength(8)
    @MaxLength(32)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "password is too weak" }
    )
    @IsString()
    password: string
}

export interface JwtPayload {
    username: string
}


import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
      phoneNumber: 'phoneNumber',
      passwordField: 'password',
    })
  }

  async validate(
    request: Request,
  ): Promise<any> {

    try {
      const user = await this.authService.validateUser(request.body)

      if (!user) {
        throw new HttpException('Неверный логин или пароль', HttpStatus.UNAUTHORIZED)
      }

      return user
    } catch (err) {
      if (err.response === 'Неверный логин или пароль') {
        throw err
      } else if (err.response === 'Необходимо подтвердить email') {
        throw err
      } else if (err.response === 'Пользователь не найден') {
        throw err
      } else if (err.response === 'Не верный логин или пароль') {
        throw err
      } else {
        throw new HttpException('validateStrategy', HttpStatus.FORBIDDEN)
      }
    }
  }
}

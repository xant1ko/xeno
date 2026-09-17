import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // Делаем guard доступным через Nest DI.
export class JwtAuthGuard extends AuthGuard('jwt') {} // Используем passport-стратегию с именем jwt.

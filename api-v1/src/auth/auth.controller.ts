import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto, AuthUserResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthenticatedUser, AuthResult } from './types/auth.type';

const accessTokenCookieName = 'xeno_access_token'; // Имя cookie одинаково в Set-Cookie, JwtStrategy и Swagger.
const accessTokenCookiePath = '/api/v1'; // Cookie отправляется только API-маршрутам, а не всем путям домена.

@ApiTags('auth') // Группируем ручки аутентификации в Swagger.
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрировать пользователя' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные логин или пароль.' })
  @ApiConflictResponse({ description: 'Логин уже занят.' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto);
    this.setAccessTokenCookie(response, result); // Записываем JWT в заголовок, недоступный JavaScript.
    return { user: result.user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Войти по логину и паролю' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Некорректные логин или пароль.' })
  @ApiUnauthorizedResponse({ description: 'Неверный логин или пароль.' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    this.setAccessTokenCookie(response, result); // Каждый успешный вход заменяет прежний JWT новой cookie.
    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth(accessTokenCookieName)
  @ApiOperation({ summary: 'Выйти и удалить cookie авторизации' })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) response: Response): void {
    // Для удаления браузер должен получить те же name/path/secure/sameSite, что у исходной cookie.
    response.clearCookie(accessTokenCookieName, this.getCookieClearOptions());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(accessTokenCookieName)
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Cookie JWT отсутствует, повреждён или просрочен.' })
  me(@CurrentUser() user: AuthenticatedUser): AuthUserResponseDto {
    return user;
  }

  private setAccessTokenCookie(response: Response, result: AuthResult): void {
    response.cookie(accessTokenCookieName, result.access_token, this.getCookieOptions());
  }

  private getCookieOptions(): { httpOnly: true; secure: boolean; sameSite: 'lax'; maxAge: number; path: string } {
    // Environment-переменные всегда строки, поэтому явно преобразуем значение перед передачей Express.
    const configuredMaxAge = this.configService.get<string | number>('JWT_COOKIE_MAX_AGE_MS', 86_400_000);
    const maxAge = Number(configuredMaxAge);
    return {
      httpOnly: true, // Браузер отправляет cookie сам, но document.cookie и XSS не прочитают JWT.
      secure: this.configService.get<string>('JWT_COOKIE_SECURE', 'false') === 'true', // HTTPS-only в production, HTTP допускается для localhost development.
      sameSite: 'lax', // Защищает от большинства CSRF-навигаций, не мешая same-origin Vite/Nginx-прокси.
      maxAge: Number.isFinite(maxAge) && maxAge > 0 ? maxAge : 86_400_000, // Неверное env-значение не создаёт вечную или мгновенно истёкшую cookie.
      path: accessTokenCookiePath,
    };
  }

  private getCookieClearOptions(): { httpOnly: true; secure: boolean; sameSite: 'lax'; path: string } {
    const { maxAge: _maxAge, ...clearOptions } = this.getCookieOptions();
    // Не передаём maxAge: Express сам выставляет истёкшую дату для удаления cookie.
    return clearOptions;
  }
}

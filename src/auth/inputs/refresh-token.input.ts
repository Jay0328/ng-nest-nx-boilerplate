import { IsJWT } from 'class-validator';

export class RefreshTokenInput {
  @IsJWT()
  refreshToken: string;
}

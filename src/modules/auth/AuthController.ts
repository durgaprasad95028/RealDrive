/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — AUTHENTICATION CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/login
 * - GET  /api/v1/auth/me
 * - PUT  /api/v1/auth/profile
 * - POST /api/v1/auth/2fa/setup
 * - POST /api/v1/auth/2fa/verify
 * - POST /api/v1/auth/logout
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { AuthService } from './AuthService.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from './JwtService.js';

export class AuthController {
  private router: RouterRegistry;
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.router = new RouterRegistry('/auth');
    this.authService = authService;
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Register
    this.router.post('/register', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const { username, email, password, countryCode } = req.body;
      if (!username || !email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: {
            code: 'MISSING_FIELDS',
            message: 'Username, email, and password are required fields.',
          },
        });
      }

      const result = await this.authService.register({ username, email, password, countryCode });
      res.cookie('token', result.accessToken, { maxAge: 86400000, httpOnly: true });
      return res.status(HttpStatus.CREATED).json(result);
    });

    // Login
    this.router.post('/login', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const { username, password, twoFactorCode } = req.body;
      if (!username || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: {
            code: 'MISSING_FIELDS',
            message: 'Username and password are required.',
          },
        });
      }

      const result = await this.authService.login(
        { username, password, twoFactorCode },
        req.remoteIp
      );
      res.cookie('token', result.accessToken, { maxAge: 86400000, httpOnly: true });
      return res.json(result);
    });

    // Get current user profile (requires auth header or cookie)
    this.router.get('/me', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: { code: 'UNAUTHORIZED', message: 'No authentication token provided.' },
        });
      }

      const verification = JwtService.verify(token);
      if (!verification.valid || !verification.payload) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: { code: 'INVALID_TOKEN', message: verification.error || 'Token expired or invalid.' },
        });
      }

      const userData = await this.authService.getCurrentUser(verification.payload.sub);
      return res.json(userData);
    });

    // Update profile
    this.router.put('/profile', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        });
      }

      const verification = JwtService.verify(token);
      if (!verification.valid || !verification.payload) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: { code: 'INVALID_TOKEN', message: 'Token invalid.' },
        });
      }

      const updated = await this.authService.updateProfile(verification.payload.sub, req.body);
      return res.json(updated);
    });

    // 2FA Setup
    this.router.post('/2fa/setup', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verification = JwtService.verify(token);
      if (!verification.valid || !verification.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });

      const setupResult = await this.authService.setupTwoFactor(verification.payload.sub);
      return res.json(setupResult);
    });

    // 2FA Verify
    this.router.post('/2fa/verify', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verification = JwtService.verify(token);
      if (!verification.valid || !verification.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });

      const { code } = req.body;
      if (!code) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Code is required' });

      const enabled = await this.authService.verifyAndEnableTwoFactor(verification.payload.sub, code);
      return res.json({ success: enabled, message: 'Two-factor authentication successfully activated.' });
    });

    // Logout
    this.router.post('/logout', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      res.clearCookie('token');
      return res.json({ success: true, message: 'Session terminated successfully.' });
    });
  }

  private extractToken(req: CustomHttpRequest): string | null {
    const authHeader = req.headers['authorization'] as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    if (req.cookies && req.cookies['token']) {
      return req.cookies['token'];
    }
    return null;
  }
}

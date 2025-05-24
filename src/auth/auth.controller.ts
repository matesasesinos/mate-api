import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiSecurity } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ 
    summary: 'Login with email and password',
    description: 'Authenticate a user with email and password credentials'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { 
          type: 'string', 
          format: 'email', 
          example: 'user@example.com',
          description: 'User email address'
        },
        password: { 
          type: 'string', 
          format: 'password', 
          example: 'password123',
          description: 'User password'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John' },
                lastname: { type: 'string', example: 'Doe' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials' },
            error: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ 
    summary: 'Initiate Google OAuth login',
    description: 'Redirects to Google OAuth login page'
  })
  @ApiSecurity('google-oauth')
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ 
    summary: 'Google OAuth callback',
    description: 'Handles the callback from Google OAuth authentication'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Google login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John' },
                lastname: { type: 'string', example: 'Doe' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No user from google' },
            error: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
  })
  googleAuthCallback(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ 
    summary: 'Initiate Facebook OAuth login',
    description: 'Redirects to Facebook OAuth login page'
  })
  @ApiSecurity('facebook-oauth')
  facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ 
    summary: 'Facebook OAuth callback',
    description: 'Handles the callback from Facebook OAuth authentication'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Facebook login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John' },
                lastname: { type: 'string', example: 'Doe' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No user from facebook' },
            error: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
  })
  facebookAuthCallback(@Req() req) {
    return this.authService.facebookLogin(req);
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Request password reset',
    description: 'Sends a password reset link to the user email'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { 
          type: 'string', 
          format: 'email', 
          example: 'user@example.com',
          description: 'Email address to send reset link'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'If an account exists with this email, you will receive a password reset link' },
          },
        },
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return { message: 'If an account exists with this email, you will receive a password reset link' };
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password with token',
    description: 'Reset user password using the token received by email'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: { 
          type: 'string', 
          example: 'reset-token-from-email',
          description: 'Reset token received by email'
        },
        newPassword: { 
          type: 'string', 
          format: 'password', 
          example: 'newpassword123',
          description: 'New password to set'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Password has been reset successfully' },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid or expired token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid or expired reset token' },
            error: { type: 'string', example: 'Bad Request' },
            statusCode: { type: 'number', example: 400 },
          },
        },
      },
    },
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password has been reset successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change password',
    description: 'Change user password (requires authentication)'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: { 
          type: 'string', 
          format: 'password', 
          example: 'oldpassword',
          description: 'Current password'
        },
        newPassword: { 
          type: 'string', 
          format: 'password', 
          example: 'newpassword123',
          description: 'New password to set'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Password has been changed successfully' },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Current password is incorrect' },
            error: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
  })
  async changePassword(
    @Req() req,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.changePassword(req.user.id, currentPassword, newPassword);
    return { message: 'Password has been changed successfully' };
  }
} 
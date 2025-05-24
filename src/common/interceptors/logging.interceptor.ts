import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable() //solo para ambientes de desarrollo o staging
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isProduction = process.env.NODE_ENV === 'production'; 
    
    // Si es producción, solo pasar la request sin logging
    if (isProduction) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = request.user?.id || 'anonymous';

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        console.log({
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode,
          contentLength,
          userAgent,
          ip,
          userId,
          responseTime: Date.now() - now,
          environment: process.env.NODE_ENV,
        });
      }),
    );
  }
} 
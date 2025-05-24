import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        // Log the error
        console.error({
          timestamp: new Date().toISOString(),
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context: {
            path: context.switchToHttp().getRequest().path,
            method: context.switchToHttp().getRequest().method,
          },
        });

        // Handle known errors
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Handle unknown errors
        const isProduction = process.env.NODE_ENV === 'production';
        return throwError(() => new HttpException(
          isProduction ? 'Internal server error' : error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ));
      }),
    );
  }
} 
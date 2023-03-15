import { Inject, Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { concatMap, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { BASE_PATH } from '../tokens/base-url.token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(@Inject(BASE_PATH) private basePath: string, private tokenService: TokenService) {
	}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let requestToForward = request;

		if (!request.url.startsWith(this.basePath) || request.url.startsWith(this.basePath + '/auth')) {
			return next.handle(request);
		}

		return this.tokenService.getToken().pipe(
			concatMap((token: string) => {
				requestToForward = request.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`
					}
				});

				return next.handle(requestToForward)
			})
		)
	}
}

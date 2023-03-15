import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TokenService } from '../services/token.service';
import { TokenInterceptor } from './token-interceptor';
import { BASE_PATH } from '../tokens/base-url.token';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokenService: TokenService;
  const basePath = 'https://example.com/api'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenInterceptor,
        { provide: TokenService, useValue: { getToken: () => of('abc123') } },
        { provide: BASE_PATH, useValue: basePath },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });

    interceptor = TestBed.inject(TokenInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add token to headers', (done) => {
    spyOn(tokenService, 'getToken').and.returnValue(of('abc123'));

    httpClient.get(`${basePath}/users`).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${basePath}/users`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('should not add token to headers for non-matching URL', (done) => {
    spyOn(tokenService, 'getToken').and.returnValue(of('abc123'));

    httpClient.get('/public/users').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/public/users');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not add token to headers for authentication URL', (done) => {
    spyOn(tokenService, 'getToken').and.returnValue(of('abc123'));

    httpClient.post(`${basePath}/auth/login`, {}).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${basePath}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});

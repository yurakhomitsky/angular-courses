import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { BASE_PATH } from '../tokens/base-url.token';

describe('TokenService', () => {
  let service: TokenService;
  let httpMock: HttpTestingController;
  const myBasePath = 'myBasePath'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TokenService, { provide: BASE_PATH, useValue: myBasePath }],
    });
    service = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a token', () => {
    const dummyToken = 'dummyToken';

    service.getToken().subscribe((token: string) => {
      expect(token).toEqual(dummyToken);
    });

    const req = httpMock.expectOne(`${myBasePath}/auth/anonymous?platform=subscriptions`);
    expect(req.request.method).toBe('GET');
    req.flush({ token: dummyToken });

  });

  it('should return cached token if available', () => {
    const dummyToken = 'dummyToken';

    service.getToken().subscribe();

    const req = httpMock.expectOne(`${myBasePath}/auth/anonymous?platform=subscriptions`);
    req.flush({ token: dummyToken });

    service.getToken().subscribe((token: string) => {
      expect(token).toEqual(dummyToken)
    });

    httpMock.expectNone(`${myBasePath}/auth/anonymous?platform=subscriptions`);
  })
})

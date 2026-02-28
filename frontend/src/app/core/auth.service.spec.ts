import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token', () => {
    const credentials = { username: 'admin', password: 'password' };
    const expectedToken = btoa('admin:password');

    service.login(credentials).subscribe();

    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedToken}`);
    req.flush({});

    expect(service.getToken()).toBe(expectedToken);
    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  it('should logout and remove token', () => {
    localStorage.setItem('auth_token', 'test-token');
    service = TestBed.inject(AuthService); // Re-inject to pick up token

    service.logout();
    expect(service.getToken()).toBeNull();
    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when logged in', (done) => {
    isLoggedInSubject.next(true);
    const result = guard.canActivate({} as any, {} as any);
    if (result instanceof Observable) {
      result.subscribe(val => {
        expect(val).toBeTrue();
        done();
      });
    } else {
      expect(result).toBeTrue();
      done();
    }
  });

  it('should redirect to login when not logged in', (done) => {
    isLoggedInSubject.next(false);
    const result = guard.canActivate({} as any, {} as any);
    const urlTree = router.createUrlTree(['/login']);
    
    if (result instanceof Observable) {
      result.subscribe(val => {
        expect(val).toEqual(urlTree);
        done();
      });
    } else {
      expect(result).toEqual(urlTree);
      done();
    }
  });
});

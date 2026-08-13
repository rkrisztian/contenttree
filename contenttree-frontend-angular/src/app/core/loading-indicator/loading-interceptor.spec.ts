import { TreeApiService } from '@/app/api/tree-api.service';
import { loadingInterceptor } from '@/app/core/loading-indicator/loading-interceptor';
import { TREE_API_BASE_URL } from '@/test-utils/msw-mocks';
import { it } from '@/test-utils/msw-test';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { lastValueFrom } from 'rxjs';
import { LoadingService } from './loading.service';

describe('loadingInterceptor', () => {
  let treeApiService: TreeApiService;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([loadingInterceptor])),
        TreeApiService,
        LoadingService,
      ],
    });

    treeApiService = TestBed.inject(TreeApiService);
    loadingService = TestBed.inject(LoadingService);
  });

  it('should set loading state on network connection', async ({ server }) => {
    server.use(
      http.post(`${TREE_API_BASE_URL}/move`, () => {
        return HttpResponse.json({});
      }),
    );

    const moveNodeResp = treeApiService.moveNode(2, 3);
    TestBed.tick();

    expect(loadingService.isLoading()).toBeTruthy();

    await lastValueFrom(moveNodeResp);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(loadingService.isLoading()).toBeFalsy();
  });
});

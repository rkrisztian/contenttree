import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { lastValueFrom } from 'rxjs';
import { TREE_API_BASE_URL } from '../../../test-utils/msw-mocks';
import { it } from '../../../test-utils/msw-test';
import { TREE_API_BASE_PATH, TreeApiService } from '../../api/tree-api.service';
import { errorInterceptor } from './error-interceptor';
import { ErrorService } from './error.service';

describe('errorInterceptor', () => {
  let treeApiService: TreeApiService;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        TreeApiService,
        ErrorService,
      ],
    });

    treeApiService = TestBed.inject(TreeApiService);
    errorService = TestBed.inject(ErrorService);
  });

  it('should show error on missing backend connection', async ({ server }) => {
    server.use(
      http.post(`${TREE_API_BASE_URL}/move`, async () => {
        return HttpResponse.error();
      }),
    );

    await expect(lastValueFrom(treeApiService.moveNode(2, 3))).rejects.toThrow(
      expect.objectContaining({ name: 'HttpErrorResponse', status: 0 }),
    );

    expect(errorService.latestError()).toMatchObject(
      expect.objectContaining({ error: 'Unexpected error' }),
    );
  });

  it('should show error with trace ID on bad response', async ({ server }) => {
    server.use(
      http.post(`${TREE_API_BASE_URL}/move`, async () => {
        return HttpResponse.json(
          {
            status: 400,
            error: 'Content tree service error',
            message: 'Node cannot be moved into a descendant',
            path: `${TREE_API_BASE_PATH}/move`,
            traceId: '0123456789abcdef0123456789abcdef',
            trace: 'Node cannot be moved into a descendant',
            timestamp: '2026-01-01T11:12:13.001234567Z',
          },
          { status: 400 },
        );
      }),
    );

    await expect(lastValueFrom(treeApiService.moveNode(2, 3))).rejects.toThrow(
      expect.objectContaining({ name: 'HttpErrorResponse', status: 400 }),
    );

    expect(errorService.latestError()).toMatchObject({
      error: 'Content tree service error',
      message: 'Node cannot be moved into a descendant',
      traceId: '0123456789abcdef0123456789abcdef',
    });
  });
});

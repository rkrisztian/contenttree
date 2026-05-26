import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { ThemeToggleService } from './theme-toggle.service';

describe('ThemeToggleService', () => {
  let service: ThemeToggleService;
  let mockMatchMedia: Mock<(query: string) => Partial<MediaQueryList>>;
  let storageGetItemSpy: Mock<(key: string) => string | null>;
  let storageSetItemSpy: Mock<(key: string, value: string) => void>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
            setStyle: vi.fn().mockImplementation(() => {
              /* dummy */
            }),
          },
        },
      ],
    });
    service = TestBed.inject(ThemeToggleService);

    globalThis.matchMedia = mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
    }));
    storageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    storageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as { matchMedia?: typeof globalThis.matchMedia }).matchMedia;
  });

  it('should initialize with dark mode if prefers dark mode', () => {
    mockMatchMedia.mockReturnValue({ matches: true, addEventListener: vi.fn() });
    storageGetItemSpy.mockReturnValue(null);

    service.initializeTheme();
    TestBed.tick();

    expect(service.mode()).toBe('dark');
  });

  it('should initialize with light mode if prefers light mode', () => {
    mockMatchMedia.mockReturnValue({ matches: false, addEventListener: vi.fn() });
    storageGetItemSpy.mockReturnValue(null);

    service.initializeTheme();
    TestBed.tick();

    expect(service.mode()).toBe('light');
  });

  it('should toggle mode and store it', () => {
    mockMatchMedia.mockReturnValue({ matches: false, addEventListener: vi.fn() });
    storageGetItemSpy.mockReturnValue(null);

    service.initializeTheme();
    TestBed.tick();
    storageGetItemSpy.mockReturnValue('light');
    service.changeMode();

    expect(service.mode()).toBe('dark');
    expect(storageSetItemSpy.mock.calls).toEqual([[ThemeToggleService.STORAGE_KEY, 'dark']]);
  });
});

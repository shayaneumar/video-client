import { TestBed, inject } from '@angular/core/testing';

import { VideoClientService } from './video-client.service';

describe('VideoClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoClientService]
    });
  });

  it('should be created', inject([VideoClientService], (service: VideoClientService) => {
    expect(service).toBeTruthy();
  }));
});

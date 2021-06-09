import { TestBed } from '@angular/core/testing';

import { ProjectloadService } from './projectload.service';

describe('ProjectloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectloadService = TestBed.get(ProjectloadService);
    expect(service).toBeTruthy();
  });
});

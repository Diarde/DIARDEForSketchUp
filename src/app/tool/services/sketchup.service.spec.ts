import { TestBed } from '@angular/core/testing';

import { SketchupService } from './sketchup.service';

describe('SketchupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SketchupService = TestBed.get(SketchupService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MaileditorService } from './maileditor.service';

describe('MaileditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaileditorService = TestBed.get(MaileditorService);
    expect(service).toBeTruthy();
  });
});

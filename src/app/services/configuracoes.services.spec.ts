import { TestBed } from '@angular/core/testing';

import { ConfiguracoesServices } from './configuracoes.services';

describe('ConfiguracoesServices', () => {
  let service: ConfiguracoesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracoesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

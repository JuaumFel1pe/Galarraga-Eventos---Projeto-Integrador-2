import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Pagamento } from './pagamento';
import { Sessao, autenticacao } from './sessao';

describe('Integração com a API Galarraga', () => {
  let requests: HttpTestingController;
  let sessao: Sessao;

  beforeEach(() => {
    sessionStorage.removeItem('galarraga.token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([autenticacao])), provideHttpClientTesting()],
    });
    requests = TestBed.inject(HttpTestingController);
    sessao = TestBed.inject(Sessao);
  });

  afterEach(() => { sessao.sair(); requests.verify(); });

  it('autentica, consulta o perfil e só envia ao checkout a seleção de ingressos', async () => {
    const entrar = firstValueFrom(sessao.entrar('cliente@example.test', 'senha-de-teste'));
    const login = requests.expectOne('/auth/login');
    expect(login.request.method).toBe('POST');
    login.flush({ token: 'exemplo' });

    const perfil = requests.expectOne('/api/usuarios/me');
    expect(perfil.request.headers.get('Authorization')).toBe('Bearer exemplo');
    perfil.flush({ nome: 'Cliente', role: 'USER' });
    await expect(entrar).resolves.toMatchObject({ role: 'USER' });

    const selecao = [{ idTipoIngresso: 1, quantidade: 2 }];
    const confirmar = firstValueFrom(TestBed.inject(Pagamento).confirmar(selecao));
    const pedido = requests.expectOne('/api/pedidos');
    expect(pedido.request.headers.get('Authorization')).toBe('Bearer exemplo');
    expect(pedido.request.body).toEqual({ itens: selecao });
    pedido.flush({ id: 5, status: 'CONFIRMADO' });
    await expect(confirmar).resolves.toMatchObject({ id: 5 });
  });
});

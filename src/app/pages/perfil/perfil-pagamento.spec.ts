import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { EventosService } from '../../services/eventos.service';
import { LoginService } from '../../services/login.service';
import { Pedido, PedidosService } from '../../services/pedidos.service';
import { Perfil } from './perfil';

describe('Retorno do checkout no perfil', () => {
  const pedido: Pedido = {
    id: 7, idUsuario: 1, dataPedido: '', valorTotal: 30, status: 'PENDENTE_PAGAMENTO', itens: [],
    mercadoPago: true, urlPagamento: 'https://www.mercadopago.com.br/checkout/teste',
  };
  const pago: Pedido = { ...pedido, status: 'CONFIRMADO', urlPagamento: null };
  let consultarPagamento: ReturnType<typeof vi.fn>;

  function perfil(params: Record<string, string> = {}) {
    consultarPagamento = vi.fn().mockReturnValue(of(pago));
    TestBed.configureTestingModule({ providers: [
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(params) } } },
      { provide: EventosService, useValue: { tipos: () => of([]) } },
      { provide: LoginService, useValue: {} },
      { provide: PedidosService, useValue: { consultar: () => of([pedido]), sincronizarPagamento: consultarPagamento } },
    ] });
    const pagina = TestBed.runInInjectionContext(() => new Perfil());
    pagina.ngOnInit();
    return pagina;
  }

  it('consulta o pedido pendente quando a aba do perfil volta a ficar visível', () => {
    const pagina = perfil();
    const visibilidade = vi.spyOn(document, 'visibilityState', 'get');
    try {
      pagina.acompanharPagamento(pedido.id);
      visibilidade.mockReturnValue('hidden');
      pagina.aoVoltarParaAba();
      expect(consultarPagamento).not.toHaveBeenCalled();

      visibilidade.mockReturnValue('visible');
      pagina.aoVoltarParaAba();
      pagina.aoVoltarParaAba();
      expect(consultarPagamento).toHaveBeenCalledExactlyOnceWith(7);
      expect(pagina.pagamentoConfirmado()).toBe(7);
      expect(pagina.pedidos()[0].status).toBe('CONFIRMADO');
    } finally {
      visibilidade.mockRestore();
    }
  });

  it('consulta a API quando o checkout redireciona de volta ao perfil', () => {
    const pagina = perfil({ pedido: '7' });
    expect(consultarPagamento).toHaveBeenCalledExactlyOnceWith(7);
    expect(pagina.pagamentoConfirmado()).toBe(7);
  });
});

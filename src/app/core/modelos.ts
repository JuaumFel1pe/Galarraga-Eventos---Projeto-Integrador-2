export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string | null;
  dataCadastro: string;
  ativo: boolean;
  role: 'ADMIN' | 'USER';
}

export interface Cadastro {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface LocalEvento {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  capacidade: number;
}

export interface Evento {
  id: number;
  idLocal: number;
  idCategoria: number;
  titulo: string;
  descricao: string | null;
  bannerUrl: string | null;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'CANCELADO' | 'ENCERRADO';
}

export interface TipoIngresso {
  id: number;
  idEvento: number;
  nome: string;
  preco: number;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}

export interface Ingresso {
  id: number;
  idItem: number;
  codigoQr: string;
  status: 'VALIDO' | 'UTILIZADO' | 'CANCELADO';
  dataUso: string | null;
}

export interface ItemPedido {
  id: number;
  idTipoIngresso: number;
  quantidade: number;
  precoUnitario: number;
  ingressos: Ingresso[];
}

export interface Pedido {
  id: number;
  idUsuario: number;
  dataPedido: string;
  valorTotal: number;
  status: 'CONFIRMADO' | 'CANCELADO';
  itens: ItemPedido[];
}

export interface Venda {
  id: number;
  cliente: string;
  dataPedido: string;
  valorTotal: number;
  status: Pedido['status'];
  quantidade: number;
  cancelavel: boolean;
}

export interface Configuracao {
  endereco: string;
  telefone: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

const URL_BASE_API = '/api';

export const clienteApi = {
  // Ingredientes
  async obterIngredientes() {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/`);
    if (!resposta.ok) throw new Error('Falha ao carregar ingredientes');
    return resposta.json();
  },

  async criarIngrediente(dados) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(Object.values(erro).flat().join(' ') || 'Erro ao criar ingrediente');
    }
    return resposta.json();
  },

  async atualizarIngrediente(id, dados) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(Object.values(erro).flat().join(' ') || 'Erro ao atualizar ingrediente');
    }
    return resposta.json();
  },

  async excluirIngrediente(id) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/${id}/`, {
      method: 'DELETE',
    });
    if (!resposta.ok) throw new Error('Falha ao excluir ingrediente');
    return true;
  },

  async alternarVencido(id) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/${id}/toggle-vencido/`, {
      method: 'POST',
    });
    if (!resposta.ok) throw new Error('Falha ao alternar status de vencido');
    return resposta.json();
  },

  async alternarFaltaMes(id) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/${id}/toggle-falta-mes/`, {
      method: 'POST',
    });
    if (!resposta.ok) throw new Error('Falha ao alternar falta no mês');
    return resposta.json();
  },

  // Lista de Compras
  async obterListaCompras() {
    const resposta = await fetch(`${URL_BASE_API}/compras/`);
    if (!resposta.ok) throw new Error('Falha ao obter lista de compras');
    return resposta.json();
  },

  async obterListaComprasTexto() {
    const resposta = await fetch(`${URL_BASE_API}/compras/texto/`);
    if (!resposta.ok) throw new Error('Falha ao baixar lista de compras');
    return resposta.text();
  },

  async atualizarMetasAjustadas() {
    const resposta = await fetch(`${URL_BASE_API}/compras/atualizar-metas/`, {
      method: 'POST',
    });
    if (!resposta.ok) throw new Error('Falha ao atualizar metas');
    return resposta.json();
  },

  async salvarHistoricoCompras() {
    const resposta = await fetch(`${URL_BASE_API}/compras/salvar-historico/`, {
      method: 'POST',
    });
    if (!resposta.ok) throw new Error('Falha ao arquivar histórico');
    return resposta.json();
  },

  // Histórico
  async obterHistorico() {
    const resposta = await fetch(`${URL_BASE_API}/historico/`);
    if (!resposta.ok) throw new Error('Falha ao carregar histórico');
    return resposta.json();
  },

  async excluirHistorico(id) {
    const resposta = await fetch(`${URL_BASE_API}/historico/${id}/`, {
      method: 'DELETE',
    });
    if (!resposta.ok) throw new Error('Falha ao apagar registro do histórico');
    return true;
  },

  // Dashboard / Métricas
  async obterEstatisticasPainel() {
    const resposta = await fetch(`${URL_BASE_API}/dashboard/`);
    if (!resposta.ok) throw new Error('Falha ao carregar estatísticas do painel');
    return resposta.json();
  },

  // Confirmação de Compra
  async confirmarCompra() {
    const resposta = await fetch(`${URL_BASE_API}/compras/confirmar-compra/`, {
      method: 'POST',
    });
    if (!resposta.ok) throw new Error('Falha ao confirmar compra');
    return resposta.json();
  },

  // Atualização em Lote de Estoques
  async atualizarEstoquesEmLote(itens) {
    const resposta = await fetch(`${URL_BASE_API}/ingredientes/atualizar-em-lote/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens }),
    });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Falha ao atualizar estoques em lote');
    }
    return resposta.json();
  },
};

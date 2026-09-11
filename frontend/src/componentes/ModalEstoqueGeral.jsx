import React, { useState, useEffect } from 'react';

export default function ModalEstoqueGeral({
  estaAberto,
  aoFechar,
  ingredientes = [],
  aoSalvarLote,
  carregando = false
}) {
  const [valoresEstoque, definirValoresEstoque] = useState({});
  const [consultaFiltro, definirConsultaFiltro] = useState('');

  useEffect(() => {
    if (estaAberto) {
      const mapaInicial = {};
      ingredientes.forEach((item) => {
        mapaInicial[item.id] = item.estoque_atual !== undefined ? item.estoque_atual : 0;
      });
      definirValoresEstoque(mapaInicial);
      definirConsultaFiltro('');
    }
  }, [estaAberto, ingredientes]);

  if (!estaAberto) return null;

  const lidarMudancaEstoque = (id, valor) => {
    definirValoresEstoque((anterior) => ({
      ...anterior,
      [id]: valor,
    }));
  };

  const lidarPreencherMeta = (id, meta) => {
    definirValoresEstoque((anterior) => ({
      ...anterior,
      [id]: meta,
    }));
  };

  const lidarZerarEstoque = (id) => {
    definirValoresEstoque((anterior) => ({
      ...anterior,
      [id]: 0,
    }));
  };

  const lidarEnvio = (e) => {
    e.preventDefault();
    const itensAtualizados = Object.entries(valoresEstoque).map(([id, val]) => ({
      id: parseInt(id, 10),
      estoque_atual: parseFloat(val) || 0,
    }));
    aoSalvarLote(itensAtualizados);
  };

  const listaFiltrada = ingredientes.filter((item) =>
    item.nome.toLowerCase().includes(consultaFiltro.toLowerCase())
  );

  return (
    <div className="sobreposicao-modal modal-overlay" onClick={aoFechar}>
      <div
        className="conteudo-modal modal-content caixa-dialogo-estoque-lote bulk-stock-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cabecalho-modal modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem' }}>Atualizar Estoque Geral</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Altere a sobra/estoque atual de todos os itens e salve tudo de uma vez
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={aoFechar}
            aria-label="Fechar"
            disabled={carregando}
          >
            Fechar
          </button>
        </div>

        <form onSubmit={lidarEnvio}>
          <div className="corpo-modal modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div className="envoltorio-campo-busca search-input-wrapper" style={{ width: '100%', minWidth: '100%', marginBottom: '0.75rem' }}>
              <input
                id="campo-busca-estoque-geral"
                type="text"
                className="campo-busca search-input"
                placeholder="Filtrar ingredientes nesta lista..."
                value={consultaFiltro}
                onChange={(e) => definirConsultaFiltro(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {listaFiltrada.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Nenhum ingrediente corresponde à busca.
                </div>
              ) : (
                listaFiltrada.map((item) => {
                  const valorAtual = valoresEstoque[item.id] !== undefined ? valoresEstoque[item.id] : item.estoque_atual;
                  const valorNumerico = parseFloat(valorAtual) || 0;
                  const metaNumerica = parseFloat(item.meta) || 0;
                  const diferenca = metaNumerica - valorNumerico;

                  return (
                    <div
                      key={item.id}
                      className="linha-item-estoque-lote bulk-stock-item-row"
                    >
                      <div className="info-item-lote bulk-item-info">
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.nome}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Meta: <strong style={{ color: 'var(--text-secondary)' }}>{item.meta} {item.unidade}</strong>
                          {item.vencido && (
                            <span style={{ color: 'var(--rose-danger)', marginLeft: '6px' }}>
                              (Vencido)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="controles-item-lote bulk-item-controls">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className="campo-formulario form-input campo-numero-lote bulk-num-input"
                            value={valorAtual}
                            onChange={(e) => lidarMudancaEstoque(item.id, e.target.value)}
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--amber-light)', fontWeight: 600, minWidth: '28px' }}>
                            {item.unidade}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}
                            title="Zerar estoque deste item"
                            onClick={() => lidarZerarEstoque(item.id)}
                          >
                            0
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.45rem 0.65rem', fontSize: '0.75rem' }}
                            title="Preencher com o valor da meta"
                            onClick={() => lidarPreencherMeta(item.id, item.meta)}
                          >
                            Meta
                          </button>
                        </div>
                      </div>

                      <div className="status-item-lote bulk-item-status">
                        {diferenca > 0 ? (
                          <span style={{ color: 'var(--amber-light)', fontWeight: 600 }}>
                            Comprar: {diferenca.toFixed(2).replace(/\.00$/, '')} {item.unidade}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--emerald-success)', fontWeight: 500 }}>
                            Suficiente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rodape-modal modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {ingredientes.length} ingrediente(s)
            </span>

            <div style={{ display: 'flex', gap: '0.75rem', width: 'auto' }} className="botoes-rodape-modal modal-footer-btns">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={aoFechar}
                disabled={carregando}
              >
                Cancelar
              </button>

              <button
                id="botao-salvar-estoques-lote"
                type="submit"
                className="btn btn-primary"
                disabled={carregando}
              >
                <span>{carregando ? 'Salvando...' : 'Salvar Estoques'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

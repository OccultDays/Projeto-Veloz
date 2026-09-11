import React from 'react';

export default function CartoesMetricas({ estatisticas = {}, aoSelecionarFiltro }) {
  return (
    <section className="grade-metricas metrics-grid" aria-label="Indicadores principais de estoque">
      <div
        id="cartao-metrica-total"
        className="cartao-metrica metric-card"
        style={{ cursor: 'pointer' }}
        onClick={() => aoSelecionarFiltro('todos')}
      >
        <div className="informacao-metrica metric-info">
          <h3>Total de Ingredientes</h3>
          <div className="valor-metrico metric-value">{estatisticas.total_ingredientes || 0}</div>
          <div className="descricao-metrica metric-desc">Itens monitorados no cardápio</div>
        </div>
      </div>

      <div
        id="cartao-metrica-comprar"
        className="cartao-metrica metric-card"
        style={{ cursor: 'pointer' }}
        onClick={() => aoSelecionarFiltro('comprar')}
      >
        <div className="informacao-metrica metric-info">
          <h3>Itens a Comprar</h3>
          <div className="valor-metrico metric-value" style={{ color: 'var(--amber-light)' }}>
            {estatisticas.total_para_comprar || 0}
          </div>
          <div className="descricao-metrica metric-desc">Necessitam reposição imediata</div>
        </div>
      </div>

      <div
        id="cartao-metrica-vencidos"
        className="cartao-metrica metric-card"
        style={{ cursor: 'pointer' }}
        onClick={() => aoSelecionarFiltro('vencidos')}
      >
        <div className="informacao-metrica metric-info">
          <h3>Ingredientes Vencidos</h3>
          <div className="valor-metrico metric-value" style={{ color: 'var(--rose-danger)' }}>
            {estatisticas.total_vencidos || 0}
          </div>
          <div className="descricao-metrica metric-desc">Sobra descartada; compra meta cheia</div>
        </div>
      </div>

      <div
        id="cartao-metrica-faltaram"
        className="cartao-metrica metric-card"
        style={{ cursor: 'pointer' }}
        onClick={() => aoSelecionarFiltro('faltaram')}
      >
        <div className="informacao-metrica metric-info">
          <h3>Acabou no Meio do Mês</h3>
          <div className="valor-metrico metric-value" style={{ color: 'var(--orange-warning)' }}>
            {estatisticas.total_faltaram || 0}
          </div>
          <div className="descricao-metrica metric-desc">Meta baixa; +20% de margem</div>
        </div>
      </div>
    </section>
  );
}

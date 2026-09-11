import React from 'react';

export default function TabelaIngredientes({
  ingredientes = [],
  termoBusca = '',
  definirTermoBusca,
  filtroStatus = 'todos',
  definirFiltroStatus,
  aoAdicionarNovo,
  aoAbrirAtualizarEstoque,
  aoEditar,
  aoExcluir,
  aoAlternarVencido,
  aoAlternarFaltaMes,
  aoIrParaListaCompras,
}) {
  const itensFiltrados = ingredientes.filter((item) => {
    const correspondeBusca =
      item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (item.observacao && item.observacao.toLowerCase().includes(termoBusca.toLowerCase()));

    if (!correspondeBusca) return false;

    const calculo = item.calculo_reposicao || {};

    if (filtroStatus === 'comprar') return calculo.deve_comprar;
    if (filtroStatus === 'vencidos') return item.vencido;
    if (filtroStatus === 'faltaram') return item.faltou_no_meio_do_mes;
    if (filtroStatus === 'ok') return !calculo.deve_comprar;

    return true;
  });

  return (
    <div className="secao-tabela table-container-section">
      <div className="barra-ferramentas toolbar-container">
        <div className="grupo-filtro-busca search-filter-group">
          <div className="envoltorio-campo-busca search-input-wrapper">
            <input
              id="campo-busca-ingrediente"
              type="text"
              className="campo-busca search-input"
              placeholder="Buscar ingrediente"
              value={termoBusca}
              onChange={(e) => definirTermoBusca(e.target.value)}
            />
          </div>

          <select
            id="seletor-filtro-status"
            className="seletor-filtro filter-select"
            value={filtroStatus}
            onChange={(e) => definirFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os Ingredientes ({ingredientes.length})</option>
            <option value="comprar">Apenas para Comprar</option>
            <option value="vencidos">Ingredientes Vencidos</option>
            <option value="faltaram">Falta no Meio do Mês</option>
            <option value="ok">Estoque Suficiente (OK)</option>
          </select>
        </div>

        <div className="grupo-acoes actions-group">
          <button
            id="botao-adicionar-ingrediente"
            className="btn btn-blue"
            onClick={aoAdicionarNovo}
          >
            <span>Novo Ingrediente</span>
          </button>

          <button
            id="botao-atualizar-estoque"
            className="btn btn-primary"
            onClick={aoAbrirAtualizarEstoque}
          >
            <span>Atualizar Estoque</span>
          </button>

          <button
            id="botao-ver-lista-compras"
            className="btn btn-success"
            onClick={aoIrParaListaCompras}
          >
            <span>Ver Lista de Compras</span>
          </button>
        </div>
      </div>

      <div className="envoltorio-tabela table-wrapper desktop-table-view">
        <table className="tabela-dados data-table">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Unidade</th>
              <th>Meta</th>
              <th>Estoque Atual</th>
              <th>Status do Mês</th>
              <th>A Comprar</th>
              <th style={{ textAlign: 'center' }}>Ações Rápidas</th>
              <th style={{ textAlign: 'right' }}>Opções</th>
            </tr>
          </thead>
          <tbody>
            {itensFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="estado-vazio empty-state">
                    <h3>Nenhum ingrediente encontrado</h3>
                    <p>Tente ajustar a busca ou cadastre um novo ingrediente acima.</p>
                  </div>
                </td>
              </tr>
            ) : (
              itensFiltrados.map((item) => {
                const calculo = item.calculo_reposicao || {};
                const deveComprar = calculo.deve_comprar;

                let classeEtiqueta = 'ok';
                let textoEtiqueta = 'Estoque OK';

                if (item.vencido) {
                  classeEtiqueta = 'vencido';
                  textoEtiqueta = 'Vencido (Descarte)';
                } else if (item.faltou_no_meio_do_mes) {
                  classeEtiqueta = 'falta';
                  textoEtiqueta = 'Faltou (+20%)';
                } else if (deveComprar) {
                  classeEtiqueta = 'normal';
                  textoEtiqueta = 'Reposição Padrão';
                }

                return (
                  <tr key={item.id} id={`linha-ingrediente-${item.id}`}>
                    <td>
                      <div className="celula-ingrediente ingrediente-cell">
                        <span className="nome-ingrediente ingrediente-nome">{item.nome}</span>
                        {item.observacao && (
                          <span className="observacao-ingrediente ingrediente-obs">{item.observacao}</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span style={{
                        fontWeight: 600,
                        color: 'var(--amber-light)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        {item.unidade}
                      </span>
                    </td>

                    <td>
                      <strong>{calculo.meta !== undefined ? parseFloat(calculo.meta).toString() : item.meta}</strong> {item.unidade}
                    </td>

                    <td>
                      <span style={{ color: item.estoque_atual <= 0 ? 'var(--rose-danger)' : 'inherit' }}>
                        {calculo.estoque_atual !== undefined ? parseFloat(calculo.estoque_atual).toString() : item.estoque_atual} {item.unidade}
                      </span>
                    </td>

                    <td>
                      <span className={`etiqueta-status status-badge ${classeEtiqueta}`}>
                        {textoEtiqueta}
                      </span>
                    </td>

                    <td>
                      {deveComprar ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: 'var(--amber-primary)', fontSize: '0.95rem' }}>
                            {calculo.quantidade_formatada} {item.unidade}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {calculo.regra_aplicada === 'VENCIDO' && 'Meta cheia'}
                            {calculo.regra_aplicada === 'FALTA_NO_MES' && '+20% de margem'}
                            {calculo.regra_aplicada === 'NORMAL' && 'Meta - Sobra'}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          — (Nada a comprar)
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div className="grupo-botoes-alternancia toggle-switch-group" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className={`botao-alternancia-rapida quick-toggle-btn ${item.vencido ? 'active-vencido' : ''}`}
                          title="Marcar/Desmarcar se o ingrediente venceu/estragou no mês"
                          onClick={() => aoAlternarVencido(item.id)}
                        >
                          <span>{item.vencido ? 'Vencido!' : 'Venceu?'}</span>
                        </button>

                        <button
                          type="button"
                          className={`botao-alternancia-rapida quick-toggle-btn ${item.faltou_no_meio_do_mes ? 'active-falta' : ''}`}
                          title="Marcar/Desmarcar se faltou no meio do mês (+20% de margem)"
                          onClick={() => aoAlternarFaltaMes(item.id)}
                        >
                          <span>{item.faltou_no_meio_do_mes ? 'Faltou!' : 'Faltou?'}</span>
                        </button>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Editar Ingrediente"
                          onClick={() => aoEditar(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          title="Excluir Ingrediente"
                          onClick={() => aoExcluir(item.id, item.nome)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="visualizacao-cartoes-mobile mobile-cards-view">
        {itensFiltrados.length === 0 ? (
          <div className="estado-vazio empty-state">
            <h3>Nenhum ingrediente encontrado</h3>
            <p>Tente ajustar a busca ou cadastre um novo ingrediente acima.</p>
          </div>
        ) : (
          itensFiltrados.map((item) => {
            const calculo = item.calculo_reposicao || {};
            const deveComprar = calculo.deve_comprar;

            let classeEtiqueta = 'ok';
            let textoEtiqueta = 'Estoque OK';

            if (item.vencido) {
              classeEtiqueta = 'vencido';
              textoEtiqueta = 'Vencido (Descarte)';
            } else if (item.faltou_no_meio_do_mes) {
              classeEtiqueta = 'falta';
              textoEtiqueta = 'Faltou (+20%)';
            } else if (deveComprar) {
              classeEtiqueta = 'normal';
              textoEtiqueta = 'Reposição Padrão';
            }

            return (
              <div
                key={item.id}
                className="cartao-ingrediente-mobile mobile-ingredient-card"
                id={`cartao-mobile-ingrediente-${item.id}`}
              >
                <div className="cabecalho-cartao-mobile mobile-card-header">
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="titulo-cartao-mobile mobile-card-title">{item.nome}</span>
                      <span className="etiqueta-unidade unit-badge">{item.unidade}</span>
                    </div>
                    {item.observacao && (
                      <p className="observacao-cartao-mobile mobile-card-obs">{item.observacao}</p>
                    )}
                  </div>

                  <div className="acoes-cartao-mobile mobile-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      title="Editar"
                      onClick={() => aoEditar(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title="Excluir"
                      onClick={() => aoExcluir(item.id, item.nome)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div style={{ margin: '0.5rem 0' }}>
                  <span className={`etiqueta-status status-badge ${classeEtiqueta}`}>
                    {textoEtiqueta}
                  </span>
                </div>

                <div className="grade-estatisticas-mobile mobile-card-stats-grid">
                  <div className="caixa-estatistica-mobile mobile-stat-box">
                    <span className="rotulo-estatistica-mobile mobile-stat-label">Meta</span>
                    <span className="valor-estatistica-mobile mobile-stat-value">
                      {calculo.meta !== undefined ? parseFloat(calculo.meta).toString() : item.meta} {item.unidade}
                    </span>
                  </div>

                  <div className="caixa-estatistica-mobile mobile-stat-box">
                    <span className="rotulo-estatistica-mobile mobile-stat-label">Estoque Atual</span>
                    <span
                      className="valor-estatistica-mobile mobile-stat-value"
                      style={{ color: item.estoque_atual <= 0 ? 'var(--rose-danger)' : 'inherit' }}
                    >
                      {calculo.estoque_atual !== undefined ? parseFloat(calculo.estoque_atual).toString() : item.estoque_atual} {item.unidade}
                    </span>
                  </div>

                  <div className={`caixa-estatistica-mobile mobile-stat-box ${deveComprar ? 'highlight' : ''}`}>
                    <span className="rotulo-estatistica-mobile mobile-stat-label">A Comprar</span>
                    <span
                      className="valor-estatistica-mobile mobile-stat-value"
                      style={{ color: deveComprar ? 'var(--amber-primary)' : 'var(--text-muted)', fontWeight: 700 }}
                    >
                      {deveComprar ? `${calculo.quantidade_formatada} ${item.unidade}` : '—'}
                    </span>
                  </div>
                </div>

                <div className="alternadores-cartao-mobile mobile-card-toggles">
                  <button
                    type="button"
                    className={`botao-alternador-mobile mobile-toggle-btn ${item.vencido ? 'active-vencido' : ''}`}
                    onClick={() => aoAlternarVencido(item.id)}
                  >
                    <span>{item.vencido ? 'Vencido!' : 'Venceu?'}</span>
                  </button>

                  <button
                    type="button"
                    className={`botao-alternador-mobile mobile-toggle-btn ${item.faltou_no_meio_do_mes ? 'active-falta' : ''}`}
                    onClick={() => aoAlternarFaltaMes(item.id)}
                  >
                    <span>{item.faltou_no_meio_do_mes ? 'Faltou!' : 'Faltou?'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        <div
          className="cartao-ingrediente-mobile mobile-ingredient-card invisible-spacer-widget"
          aria-hidden="true"
        />
      </div>

      <div
        className="invisible-spacer-widget desktop-table-view"
        aria-hidden="true"
      />
    </div>
  );
}

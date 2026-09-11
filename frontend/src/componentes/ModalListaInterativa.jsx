import React, { useState, useEffect } from 'react';

export default function ModalListaInterativa({
  estaAberto,
  aoFechar,
  itensParaComprar = [],
  aoConfirmarCompra,
  carregando = false
}) {
  const [comprados, definirComprados] = useState({});
  const [consultaFiltro, definirConsultaFiltro] = useState('');
  const [exibirDialogoConfirmacao, definirExibirDialogoConfirmacao] = useState(false);

  useEffect(() => {
    if (!estaAberto) {
      definirExibirDialogoConfirmacao(false);
      definirConsultaFiltro('');
    }
  }, [estaAberto]);

  if (!estaAberto) return null;

  const alternarComprado = (id) => {
    definirComprados((anterior) => ({
      ...anterior,
      [id]: !anterior[id],
    }));
  };

  const lidarMarcarTodos = () => {
    const todos = {};
    itensParaComprar.forEach((item, indice) => {
      todos[item.id || indice] = true;
    });
    definirComprados(todos);
  };

  const lidarDesmarcarTodos = () => {
    definirComprados({});
  };

  const totalComprados = Object.values(comprados).filter(Boolean).length;
  const totalItens = itensParaComprar.length;
  const progresso = totalItens > 0 ? Math.round((totalComprados / totalItens) * 100) : 0;
  const estaCompleto = progresso === 100 && totalItens > 0;

  const lidarAbrirConfirmacao = () => {
    if (!estaCompleto || carregando) return;
    definirExibirDialogoConfirmacao(true);
  };

  const lidarExecutarConfirmacao = () => {
    definirExibirDialogoConfirmacao(false);
    aoConfirmarCompra();
  };

  const itensFiltrados = itensParaComprar.filter((item) =>
    (item.nome || item.texto_formatado || '').toLowerCase().includes(consultaFiltro.toLowerCase())
  );

  return (
    <div className="sobreposicao-modal modal-overlay" onClick={() => !exibirDialogoConfirmacao && aoFechar()}>
      <div
        className="conteudo-modal modal-content"
        style={{ position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {exibirDialogoConfirmacao && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 30,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-card)',
            animation: 'fadeIn 0.2s ease-out',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              Confirmar Compra dos Itens?
            </h3>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              maxWidth: '440px',
              marginBottom: '1.75rem',
              lineHeight: 1.5
            }}>
              Você marcou todos os <strong>{totalItens} itens</strong> como comprados.
              Tem certeza que deseja confirmar e <strong>atualizar o estoque automaticamente</strong> com as novas metas calculadas?
            </p>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px' }}>
              <button
                id="botao-cancelar-aviso-confirmacao"
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem 1rem' }}
                onClick={() => definirExibirDialogoConfirmacao(false)}
                disabled={carregando}
              >
                Cancelar
              </button>

              <button
                id="botao-aceitar-aviso-confirmacao"
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem 1rem' }}
                onClick={lidarExecutarConfirmacao}
                disabled={carregando}
              >
                <span>{carregando ? 'Atualizando...' : 'Sim, Atualizar'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="cabecalho-modal modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem' }}>Lista Interativa</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Checklist dinâmico de compras com unidades de medida
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={aoFechar}
            aria-label="Fechar"
            disabled={exibirDialogoConfirmacao || carregando}
          >
            Fechar
          </button>
        </div>

        <div className="corpo-modal modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="envoltorio-campo-busca search-input-wrapper" style={{ width: '100%', minWidth: '100%', marginBottom: '0.75rem' }}>
            <input
              id="campo-busca-lista-interativa"
              type="text"
              className="campo-busca search-input"
              placeholder="Filtrar ingredientes nesta lista..."
              value={consultaFiltro}
              onChange={(e) => definirConsultaFiltro(e.target.value)}
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Progresso das Compras</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: estaCompleto ? 'var(--emerald-success)' : 'var(--amber-light)' }}>
                  {totalComprados} de {totalItens} ({progresso}%)
                </strong>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    id="botao-marcar-todos-itens"
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={lidarMarcarTodos}
                    title="Marcar todos os itens como comprados"
                  >
                    Todos
                  </button>
                  <button
                    id="botao-limpar-todos-itens"
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={lidarDesmarcarTodos}
                    title="Desmarcar todos os itens"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${progresso}%`,
                height: '100%',
                background: estaCompleto
                  ? 'var(--emerald-success)'
                  : 'linear-gradient(90deg, var(--amber-primary), var(--emerald-success))',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div className="lista-interativa-checklist feira-checklist">
            {itensFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Nenhum ingrediente corresponde à busca.
              </div>
            ) : (
              itensFiltrados.map((item, indice) => {
                const chaveItem = item.id || indice;
                const estaMarcado = !!comprados[chaveItem];
                return (
                  <div
                    key={chaveItem}
                    className={`item-lista-interativa feira-item ${estaMarcado ? 'comprado' : ''}`}
                    onClick={() => alternarComprado(chaveItem)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={estaMarcado}
                        readOnly
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--emerald-success)'
                        }}
                      />
                      <div>
                        <div className="texto-item-interativo feira-item-text">
                          {item.texto_formatado}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.regra_aplicada === 'VENCIDO' && 'Motivo: Lote anterior estragou'}
                          {item.regra_aplicada === 'FALTA_NO_MES' && 'Motivo: Faltou no meio do mês (+20%)'}
                          {item.regra_aplicada === 'NORMAL' && 'Motivo: Reposição de rotina'}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: estaMarcado ? 'var(--emerald-success)' : 'var(--amber-light)'
                    }}>
                      {item.quantidade_formatada} {item.unidade}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {estaCompleto && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(4, 120, 87, 0.08)',
              border: '1px solid rgba(4, 120, 87, 0.25)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              animation: 'fadeIn 0.25s ease-out'
            }}>
              <div>
                <strong style={{ color: 'var(--emerald-success)' }}>Lista 100% concluída!</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Clique em <strong>Confirmar</strong> abaixo para atualizar automaticamente o estoque do restaurante.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rodape-modal modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {estaCompleto ? (
              <span style={{ color: 'var(--emerald-success)', fontWeight: 600 }}>
                Checklist concluído
              </span>
            ) : (
              <span>{totalComprados} de {totalItens} item(ns) marcado(s)</span>
            )}
          </span>

          <div style={{ display: 'flex', gap: '0.75rem', width: 'auto' }} className="botoes-rodape-modal modal-footer-btns">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={aoFechar}
              disabled={carregando || exibirDialogoConfirmacao}
            >
              Cancelar
            </button>

            <button
              id="botao-confirmar-estoque"
              type="button"
              className="btn btn-primary"
              onClick={lidarAbrirConfirmacao}
              disabled={!estaCompleto || carregando}
              title={estaCompleto ? 'Confirmar compra e atualizar estoque' : 'Marque todos os itens para habilitar'}
              style={{
                opacity: estaCompleto ? 1 : 0.4,
                cursor: estaCompleto ? 'pointer' : 'not-allowed',
              }}
            >
              <span>{carregando ? 'Atualizando...' : 'Confirmar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

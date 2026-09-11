import React, { useState } from 'react';

export default function VisualizacaoHistorico({ historico = [], aoExcluirHistorico, carregando = false }) {
  const [itemParaApagar, definirItemParaApagar] = useState(null);

  const lidarConfirmarExclusao = () => {
    if (!itemParaApagar) return;
    aoExcluirHistorico(itemParaApagar.id);
    definirItemParaApagar(null);
  };

  return (
    <div className="recipiente-lista-compras shopping-list-container" style={{ position: 'relative' }}>
      {itemParaApagar && (
        <div className="sobreposicao-modal modal-overlay" onClick={() => definirItemParaApagar(null)}>
          <div
            className="conteudo-modal modal-content"
            style={{ maxWidth: '480px', textAlign: 'center', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              Apagar Lista do Histórico?
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.75rem',
              lineHeight: 1.5
            }}>
              Tem certeza que deseja apagar a lista de compras arquivada em{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{itemParaApagar.data_formatada}</strong> ({itemParaApagar.total_itens} itens)? Esta ação removerá o registro permanentemente do sistema.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                id="botao-cancelar-apagar-historico"
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.7rem 1rem' }}
                onClick={() => definirItemParaApagar(null)}
                disabled={carregando}
              >
                Cancelar
              </button>

              <button
                id="botao-confirmar-apagar-historico"
                type="button"
                className="btn btn-danger"
                style={{ flex: 1, padding: '0.7rem 1rem' }}
                onClick={lidarConfirmarExclusao}
                disabled={carregando}
              >
                <span>{carregando ? 'Apagando...' : 'Sim, Apagar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="banner-cabecalho-lista list-header-banner">
        <div>
          <h2>Histórico de Listas de Compras Arquivadas</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Registro de todas as listas geradas para controle de compras passadas do sistema.
          </p>
        </div>
      </div>

      {historico.length === 0 ? (
        <div className="estado-vazio empty-state">
          <h3>Nenhum histórico arquivado ainda</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {historico.map((item) => (
            <div
              key={item.id}
              id={`cartao-historico-${item.id}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{item.data_formatada}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="etiqueta-status status-badge normal">
                    {item.total_itens} {item.total_itens === 1 ? 'item comprado' : 'itens comprados'}
                  </span>

                  <button
                    id={`botao-apagar-historico-${item.id}`}
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => definirItemParaApagar(item)}
                    title="Apagar esta lista do histórico"
                  >
                    <span>Apagar Lista</span>
                  </button>
                </div>
              </div>

              <div className="bloco-codigo-lista list-code-block" style={{ fontSize: '0.95rem', marginBottom: 0 }}>
                {item.conteudo_texto}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

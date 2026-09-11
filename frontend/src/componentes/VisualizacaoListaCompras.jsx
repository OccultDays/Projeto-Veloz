import React, { useState } from 'react';

export default function VisualizacaoListaCompras({
  dadosCompras,
  aoAbrirListaInterativa,
  carregando,
}) {
  const [copiado, definirCopiado] = useState(false);

  const {
    total_itens_a_comprar: totalItensAComprar = 0,
    linhas_texto: linhasTexto = [],
    texto_final: textoFinal = '',
    itens_para_comprar: itensParaComprar = [],
  } = dadosCompras || {};

  const lidarCopiar = () => {
    if (!textoFinal) return;
    navigator.clipboard.writeText(textoFinal);
    definirCopiado(true);
    setTimeout(() => definirCopiado(false), 2500);
  };

  return (
    <div className="recipiente-lista-compras shopping-list-container">
      <div className="banner-cabecalho-lista list-header-banner">
        <div>
          <h2>Lista de Compras Oficial do Mês</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            id="botao-copiar-lista-compras"
            className="btn btn-primary"
            onClick={lidarCopiar}
            disabled={totalItensAComprar === 0}
          >
            <span>{copiado ? 'Copiado!' : 'Copiar Lista'}</span>
          </button>

          <button
            id="botao-abrir-lista-interativa"
            className="btn btn-success"
            onClick={aoAbrirListaInterativa}
            disabled={totalItensAComprar === 0}
          >
            <span>Lista Interativa</span>
          </button>
        </div>
      </div>

      {totalItensAComprar === 0 ? (
        <div className="estado-vazio empty-state">
          <h3>Estoque totalmente abastecido!</h3>
          <p>Nenhum ingrediente necessita de compra neste ciclo mensal.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--amber-light)', fontWeight: 600 }}>
                {totalItensAComprar} {totalItensAComprar === 1 ? 'item' : 'itens'} a comprar
              </span>
            </div>

            <div className="bloco-codigo-lista list-code-block" id="texto-lista-compras">
              {textoFinal}
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Detalhamento e Justificativas de Cálculo:
          </h3>

          <div className="grade-itens-compra shopping-items-grid">
            {itensParaComprar.map((item, indice) => {
              let tipoCartao = 'normal';
              let corEtiqueta = 'var(--emerald-success)';

              if (item.regra_aplicada === 'VENCIDO') {
                tipoCartao = 'vencido';
                corEtiqueta = 'var(--rose-danger)';
              } else if (item.regra_aplicada === 'FALTA_NO_MES') {
                tipoCartao = 'falta';
                corEtiqueta = 'var(--orange-warning)';
              }

              return (
                <div key={indice} className={`cartao-item-compra shopping-item-card ${tipoCartao}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="titulo-item-compra shopping-item-title">{item.nome}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: corEtiqueta,
                    }}>
                      {item.regra_aplicada === 'VENCIDO' && 'VENCIDO'}
                      {item.regra_aplicada === 'FALTA_NO_MES' && '+20% MARGEM'}
                      {item.regra_aplicada === 'NORMAL' && 'NORMAL'}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {item.texto_formatado}
                  </div>

                  <p className="motivo-item-compra shopping-item-reason">
                    {item.motivo}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

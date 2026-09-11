import React from 'react';

export default function BarraNavegacao({ abaAtiva, aoMudarAba, totalParaComprar }) {
  return (
    <header className="barra-navegacao navbar">
      <div className="conteudo-navegacao navbar-content">
        <div className="secao-marca brand-section">
          <div>
            <h1 className="titulo-marca brand-title">Controle de Estoque e Reposição</h1>
          </div>
        </div>

        <nav className="navegacao-abas navbar-nav">
          <button
            id="botao-aba-estoque"
            className={`botao-aba-navegacao nav-tab-btn ${abaAtiva === 'estoque' ? 'ativo active' : ''}`}
            onClick={() => aoMudarAba('estoque')}
          >
            <span>Ingredientes & Estoque</span>
          </button>

          <button
            id="botao-aba-compras"
            className={`botao-aba-navegacao nav-tab-btn ${abaAtiva === 'compras' ? 'ativo active' : ''}`}
            onClick={() => aoMudarAba('compras')}
          >
            <span>Lista de Compras</span>
            {totalParaComprar > 0 && (
              <span className="contador-itens-comprar" style={{
                background: 'var(--rose-danger)',
                color: '#fff',
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: '999px',
                fontWeight: 700,
                marginLeft: '6px'
              }}>
                {totalParaComprar}
              </span>
            )}
          </button>

          <button
            id="botao-aba-historico"
            className={`botao-aba-navegacao nav-tab-btn ${abaAtiva === 'historico' ? 'ativo active' : ''}`}
            onClick={() => aoMudarAba('historico')}
          >
            <span>Histórico</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

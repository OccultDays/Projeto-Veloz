import React, { useState, useEffect } from 'react';

const UNIDADES_COMUNS = ['Kg', 'L', 'unidade', 'g', 'ml', 'dz', 'pct'];

export default function ModalIngrediente({ estaAberto, aoFechar, aoSalvar, itemEmEdicao }) {
  const [dadosFormulario, definirDadosFormulario] = useState({
    nome: '',
    unidade: 'Kg',
    meta: '',
    estoque_atual: '0',
    vencido: false,
    faltou_no_meio_do_mes: false,
    consumo_real: '',
    observacao: '',
  });

  const [erros, definirErros] = useState({});

  useEffect(() => {
    if (itemEmEdicao) {
      definirDadosFormulario({
        nome: itemEmEdicao.nome || '',
        unidade: itemEmEdicao.unidade || 'Kg',
        meta: itemEmEdicao.meta || '',
        estoque_atual: itemEmEdicao.estoque_atual || '0',
        vencido: !!itemEmEdicao.vencido,
        faltou_no_meio_do_mes: !!itemEmEdicao.faltou_no_meio_do_mes,
        consumo_real: itemEmEdicao.consumo_real || '',
        observacao: itemEmEdicao.observacao || '',
      });
    } else {
      definirDadosFormulario({
        nome: '',
        unidade: 'Kg',
        meta: '',
        estoque_atual: '0',
        vencido: false,
        faltou_no_meio_do_mes: false,
        consumo_real: '',
        observacao: '',
      });
    }
    definirErros({});
  }, [itemEmEdicao, estaAberto]);

  if (!estaAberto) return null;

  const validar = () => {
    const novosErros = {};
    if (!dadosFormulario.nome.trim()) {
      novosErros.nome = 'O nome do ingrediente é obrigatório.';
    }
    if (!dadosFormulario.unidade.trim()) {
      novosErros.unidade = 'A unidade de medida é obrigatória.';
    }
    if (dadosFormulario.meta === '' || isNaN(Number(dadosFormulario.meta)) || Number(dadosFormulario.meta) < 0) {
      novosErros.meta = 'Informe uma meta válida maior ou igual a zero.';
    }
    if (dadosFormulario.estoque_atual === '' || isNaN(Number(dadosFormulario.estoque_atual)) || Number(dadosFormulario.estoque_atual) < 0) {
      novosErros.estoque_atual = 'Informe um estoque atual válido.';
    }
    definirErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const lidarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const cargaUtil = {
      ...dadosFormulario,
      meta: parseFloat(dadosFormulario.meta),
      estoque_atual: parseFloat(dadosFormulario.estoque_atual),
      consumo_real: dadosFormulario.consumo_real ? parseFloat(dadosFormulario.consumo_real) : null,
    };

    aoSalvar(cargaUtil);
  };

  return (
    <div className="sobreposicao-modal modal-overlay" onClick={aoFechar}>
      <div className="conteudo-modal modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cabecalho-modal modal-header">
          <h2>{itemEmEdicao ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h2>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={aoFechar}
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={lidarEnvio}>
          <div className="corpo-modal modal-body">
            <div className="grupo-formulario form-group">
              <label className="rotulo-formulario form-label" htmlFor="campo-nome">Nome do Ingrediente *</label>
              <input
                id="campo-nome"
                type="text"
                className="campo-formulario form-input"
                placeholder="Ex: Farinha de Trigo, Leite Integral, Ovo Caipira"
                value={dadosFormulario.nome}
                onChange={(e) => definirDadosFormulario({ ...dadosFormulario, nome: e.target.value })}
                autoFocus
              />
              {erros.nome && <span style={{ color: 'var(--rose-danger)', fontSize: '0.78rem' }}>{erros.nome}</span>}
            </div>

            <div className="grupo-formulario form-group">
              <label className="rotulo-formulario form-label">Unidade de Medida *</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {UNIDADES_COMUNS.map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`btn btn-sm ${dadosFormulario.unidade === u ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => definirDadosFormulario({ ...dadosFormulario, unidade: u })}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="campo-formulario form-input"
                placeholder="Outra unidade (ex: caixa, garrafa, maço)"
                value={dadosFormulario.unidade}
                onChange={(e) => definirDadosFormulario({ ...dadosFormulario, unidade: e.target.value })}
              />
              {erros.unidade && <span style={{ color: 'var(--rose-danger)', fontSize: '0.78rem' }}>{erros.unidade}</span>}
            </div>

            <div className="form-grid-2">
              <div className="grupo-formulario form-group">
                <label className="rotulo-formulario form-label" htmlFor="campo-meta">
                  Meta Mensal ({dadosFormulario.unidade || 'unidade'}) *
                </label>
                <input
                  id="campo-meta"
                  type="number"
                  step="any"
                  min="0"
                  className="campo-formulario form-input"
                  placeholder="Ex: 50"
                  value={dadosFormulario.meta}
                  onChange={(e) => definirDadosFormulario({ ...dadosFormulario, meta: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Quantidade para manter no início do mês.
                </span>
                {erros.meta && <span style={{ color: 'var(--rose-danger)', fontSize: '0.78rem' }}>{erros.meta}</span>}
              </div>

              <div className="grupo-formulario form-group">
                <label className="rotulo-formulario form-label" htmlFor="campo-estoque">
                  Estoque Atual / Sobra ({dadosFormulario.unidade || 'unidade'}) *
                </label>
                <input
                  id="campo-estoque"
                  type="number"
                  step="any"
                  min="0"
                  className="campo-formulario form-input"
                  placeholder="Ex: 12"
                  value={dadosFormulario.estoque_atual}
                  onChange={(e) => definirDadosFormulario({ ...dadosFormulario, estoque_atual: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sobra encontrada no fim do mês.
                </span>
                {erros.estoque_atual && <span style={{ color: 'var(--rose-danger)', fontSize: '0.78rem' }}>{erros.estoque_atual}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <label className="cartao-caixa-selecao checkbox-card">
                <input
                  type="checkbox"
                  checked={dadosFormulario.vencido}
                  onChange={(e) => definirDadosFormulario({ ...dadosFormulario, vencido: e.target.checked })}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>
                    <span>O ingrediente venceu ou estragou neste mês?</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Toda a sobra será descartada e a compra considerará a <strong>meta integral</strong>.
                  </p>
                </div>
              </label>

              <label className="cartao-caixa-selecao checkbox-card">
                <input
                  type="checkbox"
                  checked={dadosFormulario.faltou_no_meio_do_mes}
                  onChange={(e) => {
                    const marcado = e.target.checked;
                    definirDadosFormulario({
                      ...dadosFormulario,
                      faltou_no_meio_do_mes: marcado,
                      estoque_atual: marcado ? '0' : dadosFormulario.estoque_atual
                    });
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>
                    <span>Acabou no meio do mês antes de terminar?</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    A meta foi insuficiente. A reposição considerará o consumo com <strong>20% de margem</strong>.
                  </p>
                </div>
              </label>

              {dadosFormulario.faltou_no_meio_do_mes && (
                <div className="grupo-formulario form-group" style={{
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <label className="rotulo-formulario form-label" htmlFor="campo-consumo">
                    Consumo Real Total do Mês ({dadosFormulario.unidade || 'unidade'})
                  </label>
                  <input
                    id="campo-consumo"
                    type="number"
                    step="any"
                    min="0"
                    className="campo-formulario form-input"
                    placeholder={`Opcional. Se vazio, assume a meta de ${dadosFormulario.meta || 0}`}
                    value={dadosFormulario.consumo_real}
                    onChange={(e) => definirDadosFormulario({ ...dadosFormulario, consumo_real: e.target.value })}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Preencha caso tenha comprado estoque extra de emergência durante o mês que também foi consumido.
                  </span>
                </div>
              )}
            </div>

            <div className="grupo-formulario form-group">
              <label className="rotulo-formulario form-label" htmlFor="campo-observacao">Observações (opcional)</label>
              <textarea
                id="campo-observacao"
                rows="2"
                className="area-texto-formulario form-textarea"
                placeholder="Ex: Fornecedor habitual, marca preferida, etc."
                value={dadosFormulario.observacao}
                onChange={(e) => definirDadosFormulario({ ...dadosFormulario, observacao: e.target.value })}
              />
            </div>
          </div>

          <div className="rodape-modal modal-footer">
            <button type="button" className="btn btn-secondary" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Salvar Ingrediente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

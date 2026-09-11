import React, { useState, useEffect, useCallback } from 'react';
import BarraNavegacao from './componentes/BarraNavegacao';
import CartoesMetricas from './componentes/CartoesMetricas';
import TabelaIngredientes from './componentes/TabelaIngredientes';
import ModalIngrediente from './componentes/ModalIngrediente';
import VisualizacaoListaCompras from './componentes/VisualizacaoListaCompras';
import ModalListaInterativa from './componentes/ModalListaInterativa';
import VisualizacaoHistorico from './componentes/VisualizacaoHistorico';
import ModalEstoqueGeral from './componentes/ModalEstoqueGeral';
import { clienteApi } from './servicos/api';

export default function Aplicacao() {
  const [abaAtiva, definirAbaAtiva] = useState('estoque');
  const [ingredientes, definirIngredientes] = useState([]);
  const [dadosCompras, definirDadosCompras] = useState(null);
  const [estatisticas, definirEstatisticas] = useState({});
  const [historico, definirHistorico] = useState([]);

  const [termoBusca, definirTermoBusca] = useState('');
  const [filtroStatus, definirFiltroStatus] = useState('todos');

  const [modalIngredienteAberto, definirModalIngredienteAberto] = useState(false);
  const [itemEmEdicao, definirItemEmEdicao] = useState(null);
  const [modalListaInterativaAberto, definirModalListaInterativaAberto] = useState(false);
  const [modalEstoqueGeralAberto, definirModalEstoqueGeralAberto] = useState(false);

  const [itemParaExcluir, definirItemParaExcluir] = useState(null);
  const [excluindoIngrediente, definirExcluindoIngrediente] = useState(false);

  const [avisoToast, definirAvisoToast] = useState(null);
  const [carregando, definirCarregando] = useState(false);

  const exibirAviso = (mensagem, tipo = 'sucesso') => {
    definirAvisoToast({ mensagem, tipo });
    setTimeout(() => definirAvisoToast(null), 3500);
  };

  const carregarDados = useCallback(async () => {
    try {
      definirCarregando(true);
      const [listaIngredientes, compras, stats, hist] = await Promise.all([
        clienteApi.obterIngredientes(),
        clienteApi.obterListaCompras(),
        clienteApi.obterEstatisticasPainel(),
        clienteApi.obterHistorico(),
      ]);

      definirIngredientes(listaIngredientes || []);
      definirDadosCompras(compras || null);
      definirEstatisticas(stats || {});
      definirHistorico(hist || []);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      exibirAviso(`Erro ao carregar dados da API: ${erro.message}`, 'erro');
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const lidarNovoIngrediente = () => {
    definirItemEmEdicao(null);
    definirModalIngredienteAberto(true);
  };

  const lidarEditar = (item) => {
    definirItemEmEdicao(item);
    definirModalIngredienteAberto(true);
  };

  const lidarSalvarIngrediente = async (dadosFormulario) => {
    try {
      if (itemEmEdicao && itemEmEdicao.id) {
        await clienteApi.atualizarIngrediente(itemEmEdicao.id, dadosFormulario);
        exibirAviso(`Ingrediente "${dadosFormulario.nome}" atualizado com sucesso!`);
      } else {
        await clienteApi.criarIngrediente(dadosFormulario);
        exibirAviso(`Ingrediente "${dadosFormulario.nome}" cadastrado com sucesso!`);
      }
      definirModalIngredienteAberto(false);
      carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao salvar ingrediente: ${erro.message}`, 'erro');
    }
  };

  const lidarExcluir = (id, nome) => {
    definirItemParaExcluir({ id, nome });
  };

  const confirmarExclusaoIngrediente = async () => {
    if (!itemParaExcluir) return;
    try {
      definirExcluindoIngrediente(true);
      await clienteApi.excluirIngrediente(itemParaExcluir.id);
      exibirAviso(`Ingrediente "${itemParaExcluir.nome}" removido do estoque.`);
      definirItemParaExcluir(null);
      await carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao excluir ingrediente: ${erro.message}`, 'erro');
    } finally {
      definirExcluindoIngrediente(false);
    }
  };

  const lidarAlternarVencido = async (id) => {
    try {
      const atualizado = await clienteApi.alternarVencido(id);
      const textoStatus = atualizado.vencido ? 'marcado como vencido' : 'desmarcado de vencido';
      exibirAviso(`"${atualizado.nome}" ${textoStatus}.`);
      carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao atualizar status: ${erro.message}`, 'erro');
    }
  };

  const lidarAlternarFaltaMes = async (id) => {
    try {
      const atualizado = await clienteApi.alternarFaltaMes(id);
      const textoStatus = atualizado.faltou_no_meio_do_mes
        ? 'marcado com falta no mês (+20% de margem aplicado)'
        : 'desmarcado de falta no mês';
      exibirAviso(`"${atualizado.nome}" ${textoStatus}.`);
      carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao atualizar status: ${erro.message}`, 'erro');
    }
  };

  const lidarConfirmarCompra = async () => {
    try {
      definirCarregando(true);
      const resposta = await clienteApi.confirmarCompra();
      exibirAviso(resposta.mensagem || 'Estoque atualizado com sucesso!');
      definirModalListaInterativaAberto(false);
      await carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao atualizar estoque: ${erro.message}`, 'erro');
    } finally {
      definirCarregando(false);
    }
  };

  const lidarExcluirHistorico = async (id) => {
    try {
      definirCarregando(true);
      await clienteApi.excluirHistorico(id);
      exibirAviso('Lista apagada do histórico com sucesso!');
      await carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao apagar histórico: ${erro.message}`, 'erro');
    } finally {
      definirCarregando(false);
    }
  };

  const lidarSalvarEstoqueGeral = async (itens) => {
    try {
      definirCarregando(true);
      const resposta = await clienteApi.atualizarEstoquesEmLote(itens);
      exibirAviso(resposta.mensagem || 'Estoques atualizados com sucesso!');
      definirModalEstoqueGeralAberto(false);
      await carregarDados();
    } catch (erro) {
      exibirAviso(`Erro ao atualizar estoques: ${erro.message}`, 'erro');
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <div>
      <BarraNavegacao
        abaAtiva={abaAtiva}
        aoMudarAba={definirAbaAtiva}
        totalParaComprar={estatisticas.total_para_comprar || 0}
      />

      <main className="recipiente-aplicacao app-container">
        <CartoesMetricas
          estatisticas={estatisticas}
          aoSelecionarFiltro={(chaveStatus) => {
            definirFiltroStatus(chaveStatus);
            definirAbaAtiva('estoque');
          }}
        />

        {abaAtiva === 'estoque' && (
          <TabelaIngredientes
            ingredientes={ingredientes}
            termoBusca={termoBusca}
            definirTermoBusca={definirTermoBusca}
            filtroStatus={filtroStatus}
            definirFiltroStatus={definirFiltroStatus}
            aoAdicionarNovo={lidarNovoIngrediente}
            aoAbrirAtualizarEstoque={() => definirModalEstoqueGeralAberto(true)}
            aoEditar={lidarEditar}
            aoExcluir={lidarExcluir}
            aoAlternarVencido={lidarAlternarVencido}
            aoAlternarFaltaMes={lidarAlternarFaltaMes}
            aoIrParaListaCompras={() => definirAbaAtiva('compras')}
          />
        )}

        {abaAtiva === 'compras' && (
          <VisualizacaoListaCompras
            dadosCompras={dadosCompras}
            aoAbrirListaInterativa={() => definirModalListaInterativaAberto(true)}
            carregando={carregando}
          />
        )}

        {abaAtiva === 'historico' && (
          <VisualizacaoHistorico
            historico={historico}
            aoExcluirHistorico={lidarExcluirHistorico}
            carregando={carregando}
          />
        )}
      </main>

      <ModalIngrediente
        estaAberto={modalIngredienteAberto}
        aoFechar={() => definirModalIngredienteAberto(false)}
        aoSalvar={lidarSalvarIngrediente}
        itemEmEdicao={itemEmEdicao}
      />

      <ModalEstoqueGeral
        estaAberto={modalEstoqueGeralAberto}
        aoFechar={() => definirModalEstoqueGeralAberto(false)}
        ingredientes={ingredientes}
        aoSalvarLote={lidarSalvarEstoqueGeral}
        carregando={carregando}
      />

      <ModalListaInterativa
        estaAberto={modalListaInterativaAberto}
        aoFechar={() => definirModalListaInterativaAberto(false)}
        itensParaComprar={(dadosCompras && dadosCompras.itens_para_comprar) || []}
        aoConfirmarCompra={lidarConfirmarCompra}
        carregando={carregando}
      />

      {itemParaExcluir && (
        <div
          className="sobreposicao-modal modal-overlay"
          id="modal-confirmacao-exclusao-ingrediente"
          onClick={() => !excluindoIngrediente && definirItemParaExcluir(null)}
        >
          <div
            className="conteudo-modal modal-content"
            style={{ maxWidth: '480px', textAlign: 'center', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.6rem',
                color: 'var(--text-primary)',
              }}
            >
              Excluir Ingrediente?
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.75rem',
                lineHeight: 1.5,
              }}
            >
              Tem certeza que deseja excluir o ingrediente{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                "{itemParaExcluir.nome}"
              </strong>{' '}
              do estoque? Esta ação removerá o registro e todo o cálculo de reposição permanentemente.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                id="botao-cancelar-exclusao-ingrediente"
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.7rem 1rem' }}
                onClick={() => definirItemParaExcluir(null)}
                disabled={excluindoIngrediente}
              >
                Cancelar
              </button>

              <button
                id="botao-confirmar-exclusao-ingrediente"
                type="button"
                className="btn btn-danger"
                style={{ flex: 1, padding: '0.7rem 1rem' }}
                onClick={confirmarExclusaoIngrediente}
                disabled={excluindoIngrediente}
              >
                <span>{excluindoIngrediente ? 'Excluindo...' : 'Sim, Excluir'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {avisoToast && (
        <div className="notificacao-toast toast-notification">
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{avisoToast.mensagem}</span>
        </div>
      )}
    </div>
  );
}

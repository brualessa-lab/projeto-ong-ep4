/* =========================================================
   formulario.js — eventos e consistência do cadastro.
   Os ouvintes ficam no document porque o formulário é criado
   pelo roteador depois que a página já carregou.
   ========================================================= */

import { Validacao } from "./validacao.js";
import { Armazenamento } from "./armazenamento.js";
import { Templates } from "./templates.js";

export const Formulario = {

  ID: "form-cadastro",

  /* ---------- leitura dos dados ---------- */

  coletar(form) {
    const dados = {};
    new FormData(form).forEach((valor, campo) => {
      dados[campo] = valor;
    });
    return dados;
  },

  /* ---------- mensagens de erro no DOM ---------- */

  limparMensagem(campo) {
    const p = campo.closest("p");
    const antiga = p.querySelector(".mensagem-erro");
    if (antiga) antiga.remove();
    campo.removeAttribute("aria-invalid");
  },

  mostrarMensagem(campo, texto) {
    Formulario.limparMensagem(campo);
    const aviso = document.createElement("span");
    aviso.className = "mensagem-erro";
    aviso.textContent = texto;
    campo.closest("p").appendChild(aviso);
    campo.setAttribute("aria-invalid", "true");
  },

  /* ---------- consistência de um campo ---------- */

  validarCampo(campo) {
    if (!campo.name) return true;

    /* primeiro a validação nativa: required, type, pattern, minlength */
    if (!campo.checkValidity()) {
      Formulario.mostrarMensagem(campo, campo.validationMessage);
      return false;
    }

    /* depois a regra extra do projeto, quando existir para este campo */
    const regra = Validacao.regras[campo.name];
    if (regra && campo.value && !regra.testar(campo.value)) {
      Formulario.mostrarMensagem(campo, regra.mensagem);
      return false;
    }

    Formulario.limparMensagem(campo);
    return true;
  },

  validarTudo(form) {
    const campos = form.querySelectorAll("input[name], select[name]");
    let primeiroComErro = null;

    campos.forEach(campo => {
      const ok = Formulario.validarCampo(campo);
      if (!ok && !primeiroComErro) primeiroComErro = campo;
    });

    if (primeiroComErro) {
      primeiroComErro.focus();
      return false;
    }
    return true;
  },

  /* ---------- envio ---------- */

  enviar(form) {
    if (!Formulario.validarTudo(form)) {
      Formulario.avisar("Confira os campos destacados antes de enviar.", "erro");
      return;
    }

    const dados = Formulario.coletar(form);
    const gravou = Armazenamento.adicionarCadastro(dados);

    if (gravou) {
      Armazenamento.limparRascunho();
      form.reset();
      Formulario.atualizarHistorico();
      const total = Armazenamento.listarCadastros().length;
      const contagem = total === 1
        ? "1 cadastro guardado"
        : total + " cadastros guardados";
      Formulario.avisar(
        "Cadastro de " + dados.nome + " enviado. Há " + contagem + " neste navegador.",
        "sucesso"
      );
    } else {
      Formulario.avisar("O navegador bloqueou o armazenamento e o cadastro não foi guardado.", "erro");
    }
  },

  /* mostra um alerta no topo da tela de cadastro */
  avisar(texto, tipo) {
    const antigo = document.getElementById("aviso-formulario");
    if (antigo) antigo.remove();

    const form = document.getElementById(Formulario.ID);
    if (!form) return;

    const caixa = document.createElement("p");
    caixa.id = "aviso-formulario";
    caixa.className = "alerta alerta-" + tipo;
    caixa.setAttribute("role", "status");
    caixa.textContent = texto;
    form.parentNode.insertBefore(caixa, form);
    caixa.scrollIntoView({ behavior: "smooth", block: "center" });
  },

  /* redesenha a lista de cadastros guardados */
  atualizarHistorico() {
    const alvo = document.getElementById("historico");
    if (alvo) alvo.innerHTML = Templates.historico();
  },

  /* ---------- rascunho enquanto digita ---------- */

  guardarRascunho(form) {
    Armazenamento.salvarRascunho(Formulario.coletar(form));
  },

  restaurarRascunho(form) {
    const rascunho = Armazenamento.lerRascunho();
    if (!rascunho) return;

    Object.keys(rascunho).forEach(nome => {
      const campo = form.elements[nome];
      if (!campo) return;
      if (campo.type === "radio" || campo instanceof RadioNodeList) {
        form.querySelectorAll('[name="' + nome + '"]').forEach(opcao => {
          opcao.checked = opcao.value === rascunho[nome];
        });
      } else {
        campo.value = rascunho[nome];
      }
    });

    Formulario.avisar("Recuperamos o que você tinha preenchido antes.", "info");
  },

  /* ---------- registro dos ouvintes ---------- */

  iniciar() {
    /* envio do formulário */
    document.addEventListener("submit", evento => {
      if (evento.target.id !== Formulario.ID) return;
      evento.preventDefault();
      Formulario.enviar(evento.target);
    });

    /* saída do campo: valida aquele campo isolado.
       O blur não sobe na árvore, por isso o ouvinte usa a fase de captura. */
    document.addEventListener("blur", evento => {
      const campo = evento.target;
      if (campo.form && campo.form.id === Formulario.ID) {
        Formulario.validarCampo(campo);
      }
    }, true);

    /* digitação: apaga a mensagem antiga e guarda o rascunho */
    document.addEventListener("input", evento => {
      const campo = evento.target;
      if (campo.form && campo.form.id === Formulario.ID) {
        Formulario.limparMensagem(campo);
        Formulario.guardarRascunho(campo.form);
      }
    });

    /* apagar os cadastros guardados */
    document.addEventListener("click", evento => {
      if (evento.target.id !== "limpar-historico") return;
      if (!window.confirm("Apagar todos os cadastros guardados neste navegador?")) return;
      Armazenamento.apagar(Armazenamento.CHAVE_CADASTROS);
      Formulario.atualizarHistorico();
      Formulario.avisar("Os cadastros guardados foram apagados.", "info");
    });

    /* quando a tela de cadastro é desenhada, devolve o rascunho */
    window.addEventListener("hashchange", Formulario.aoTrocarTela);
    Formulario.aoTrocarTela();
  },

  aoTrocarTela() {
    /* espera o roteador terminar de desenhar */
    setTimeout(() => {
      const form = document.getElementById(Formulario.ID);
      if (form) Formulario.restaurarRascunho(form);
    }, 0);
  }

};

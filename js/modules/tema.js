/* =========================================================
   tema.js — alternância entre o tema claro e o escuro.

   Por padrão a aplicação segue a preferência do sistema
   operativo, que o CSS lê com prefers-color-scheme. Quando a
   pessoa escolhe um tema pelo botão, a escolha passa a mandar:
   o atributo data-tema entra no elemento html e fica guardado
   no localStorage, para valer nas visitas seguintes.
   ========================================================= */

import { Armazenamento } from "./armazenamento.js";

export const Tema = {

  CHAVE: "semear:tema",
  botao: null,

  /* o que o sistema operativo pede, quando não há escolha guardada */
  preferenciaDoSistema() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "escuro"
      : "claro";
  },

  /* o tema que está valendo agora */
  atual() {
    return document.documentElement.getAttribute("data-tema")
      || Tema.preferenciaDoSistema();
  },

  aplicar(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    Armazenamento.gravar(Tema.CHAVE, tema);
    Tema.atualizarBotao(tema);
  },

  alternar() {
    Tema.aplicar(Tema.atual() === "escuro" ? "claro" : "escuro");
  },

  /* o botão diz o que vai acontecer ao ser premido, e o aria-pressed
     informa ao leitor de tela se o modo escuro está ativo */
  atualizarBotao(tema) {
    if (!Tema.botao) return;
    const escuro = tema === "escuro";
    Tema.botao.setAttribute("aria-pressed", escuro ? "true" : "false");
    Tema.botao.textContent = escuro ? "☀ Modo claro" : "☾ Modo escuro";
  },

  iniciar() {
    Tema.botao = document.getElementById("botao-tema");

    /* uma escolha anterior tem prioridade sobre o sistema */
    const guardado = Armazenamento.ler(Tema.CHAVE, null);
    if (guardado === "claro" || guardado === "escuro") {
      document.documentElement.setAttribute("data-tema", guardado);
    }

    Tema.atualizarBotao(Tema.atual());

    if (Tema.botao) {
      Tema.botao.addEventListener("click", Tema.alternar);
    }

    /* sem escolha guardada, a aplicação acompanha o sistema em tempo real */
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!document.documentElement.hasAttribute("data-tema")) {
        Tema.atualizarBotao(Tema.preferenciaDoSistema());
      }
    });
  }

};

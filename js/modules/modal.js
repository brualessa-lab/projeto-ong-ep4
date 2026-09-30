/* =========================================================
   modal.js — abertura e fecho do modal de informação.
   Na Experiência Prática II o modal usava :target. Como o
   endereço passou a pertencer ao roteador, o controlo é uma
   classe aplicada por JavaScript.

   Um diálogo modal precisa de três coisas além de aparecer:
   anunciar-se como diálogo, prender o foco enquanto está
   aberto e devolver o foco a quem o abriu.
   ========================================================= */

import { Templates } from "./templates.js";

export const Modal = {

  ultimoFoco: null,

  /* elementos que recebem foco por teclado */
  FOCAVEIS: 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',

  aberto() {
    return document.querySelector(".modal.aberto");
  },

  abrir(id) {
    const caixa = document.getElementById(id);
    if (!caixa) return;

    Modal.ultimoFoco = document.activeElement;
    caixa.classList.add("aberto");

    /* a ordem importa: primeiro o foco entra no diálogo, e só depois
       o resto da página sai da leitura. Assim nunca existe um instante
       em que o elemento focado está dentro de uma área marcada como
       oculta, o que confundiria o leitor de tela.
       O foco espera um ciclo, porque focar um elemento que o navegador
       ainda não terminou de tornar visível não tem efeito. */
    setTimeout(() => {
      const primeiro = caixa.querySelector(Modal.FOCAVEIS);
      if (primeiro) primeiro.focus();

      document.querySelectorAll("body > *:not(.modal)").forEach(elemento => {
        elemento.setAttribute("aria-hidden", "true");
      });
    }, 0);
  },

  fechar() {
    const caixa = Modal.aberto();
    if (!caixa) return;

    caixa.classList.remove("aberto");

    document.querySelectorAll("body > *[aria-hidden]").forEach(elemento => {
      elemento.removeAttribute("aria-hidden");
    });

    if (Modal.ultimoFoco) Modal.ultimoFoco.focus();
  },

  /* prende o Tab dentro do diálogo: no último elemento ele volta
     ao primeiro, e no primeiro com Shift ele vai para o último */
  prenderFoco(evento) {
    const caixa = Modal.aberto();
    if (!caixa) return;

    const focaveis = [...caixa.querySelectorAll(Modal.FOCAVEIS)];
    if (focaveis.length === 0) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  },

  iniciar() {
    /* o modal entra no fim do body, fora do contentor das telas,
       para sobreviver à troca de rota */
    document.body.insertAdjacentHTML("beforeend", Templates.modalDados());

    /* um único ouvinte no documento atende os elementos criados
       depois, porque as telas são desenhadas dinamicamente */
    document.addEventListener("click", evento => {
      const gatilho = evento.target.closest("[data-abrir-modal]");
      if (gatilho) {
        evento.preventDefault();
        Modal.abrir(gatilho.dataset.abrirModal);
        return;
      }

      if (evento.target.closest(".modal-fechar")) {
        evento.preventDefault();
        Modal.fechar();
        return;
      }

      /* clique no fundo escurecido, fora da caixa */
      if (evento.target.classList.contains("modal")) {
        Modal.fechar();
      }
    });

    document.addEventListener("keydown", evento => {
      if (!Modal.aberto()) return;
      if (evento.key === "Escape") Modal.fechar();
      if (evento.key === "Tab") Modal.prenderFoco(evento);
    });
  }

};

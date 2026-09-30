/* =========================================================
   modal.js — abertura e fechamento do modal de informação.
   Na EP II o modal usava :target. Como o endereço agora é do
   roteador, o controle passou para uma classe aplicada por JS.
   ========================================================= */

import { Templates } from "./templates.js";

export const Modal = {

  abrir(id) {
    const caixa = document.getElementById(id);
    if (!caixa) return;

    caixa.classList.add("aberto");
    Modal.ultimoFoco = document.activeElement;

    const primeiro = caixa.querySelector(".modal-fechar");
    if (primeiro) primeiro.focus();
  },

  fechar() {
    document.querySelectorAll(".modal.aberto").forEach(caixa => {
      caixa.classList.remove("aberto");
    });
    if (Modal.ultimoFoco) Modal.ultimoFoco.focus();
  },

  iniciar() {
    /* o modal entra no fim do body, fora do contêiner das telas,
       para sobreviver à troca de rota */
    document.body.insertAdjacentHTML("beforeend", Templates.modalDados());

    /* um único ouvinte no documento atende os links criados depois,
       porque as telas são desenhadas dinamicamente */
    document.addEventListener("click", evento => {
      const gatilho = evento.target.closest("[data-abrir-modal]");
      if (gatilho) {
        evento.preventDefault();
        Modal.abrir(gatilho.dataset.abrirModal);
        return;
      }

      /* clique no botão fechar ou fora da caixa */
      if (evento.target.closest(".modal-fechar")) {
        evento.preventDefault();
        Modal.fechar();
        return;
      }
      if (evento.target.classList.contains("modal")) {
        Modal.fechar();
      }
    });

    /* a tecla Esc também fecha */
    document.addEventListener("keydown", evento => {
      if (evento.key === "Escape") Modal.fechar();
    });
  }

};

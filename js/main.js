/* =========================================================
   main.js — ponto de entrada da aplicação.
   Importa os módulos de comportamento e os liga quando o
   documento termina de carregar.
   ========================================================= */

import { Navegacao } from "./modules/navegacao.js";
import { Modal } from "./modules/modal.js";
import { Formulario } from "./modules/formulario.js";
import { Mascaras } from "./modules/mascaras.js";

document.addEventListener("DOMContentLoaded", () => {
  Navegacao.iniciar();
  Modal.iniciar();
  Formulario.iniciar();
  Mascaras.iniciar();
});

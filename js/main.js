/* =========================================================
   main.js — ponto de entrada da aplicação.
   Importa os módulos de comportamento e os liga quando o
   documento termina de carregar.
   ========================================================= */

import { Tema } from "./modules/tema.js";
import { Navegacao } from "./modules/navegacao.js";
import { Menu } from "./modules/menu.js";
import { Modal } from "./modules/modal.js";
import { Formulario } from "./modules/formulario.js";
import { Mascaras } from "./modules/mascaras.js";

document.addEventListener("DOMContentLoaded", () => {
  Tema.iniciar();
  Menu.iniciar();
  Navegacao.iniciar();
  Modal.iniciar();
  Formulario.iniciar();
  Mascaras.iniciar();
});

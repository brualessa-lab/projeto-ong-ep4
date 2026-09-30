/* =========================================================
   menu.js — abertura e fecho do menu no celular.
   Na Experiência Prática III o controlo era um checkbox
   escondido, porque não havia JavaScript. Com script
   disponível, passou a ser um botão, que é o elemento certo
   para uma ação e aceita aria-expanded.
   ========================================================= */

export const Menu = {

  botao: null,
  nav: null,

  estaAberto() {
    return Menu.botao.getAttribute("aria-expanded") === "true";
  },

  /* o estado vive em dois lugares ao mesmo tempo: a classe, que o
     CSS usa para animar a altura, e o aria-expanded, que o leitor
     de tela usa para anunciar se o menu está aberto ou fechado */
  definir(aberto) {
    if (!Menu.botao || !Menu.nav) return;
    Menu.botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    Menu.nav.classList.toggle("aberto", aberto);
  },

  abrir() {
    Menu.definir(true);
  },

  fechar() {
    Menu.definir(false);
  },

  alternar() {
    Menu.definir(!Menu.estaAberto());
  },

  iniciar() {
    Menu.botao = document.getElementById("botao-menu");
    Menu.nav = document.getElementById("menu-principal");
    if (!Menu.botao || !Menu.nav) return;

    Menu.botao.addEventListener("click", Menu.alternar);

    /* Escape fecha o menu e devolve o foco ao botão, para quem
       navega por teclado não ficar perdido dentro da lista */
    Menu.nav.addEventListener("keydown", evento => {
      if (evento.key === "Escape" && Menu.estaAberto()) {
        Menu.fechar();
        Menu.botao.focus();
      }
    });
  }

};

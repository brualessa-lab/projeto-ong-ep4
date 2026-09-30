/* =========================================================
   navegacao.js — roteador da SPA.
   Lê o endereço depois do # e decide qual tela desenhar,
   sem o navegador recarregar a página.
   ========================================================= */

import { Templates } from "./templates.js";

export const Navegacao = {

  /* cada rota aponta para a função que a desenha e para o título
     usado na aba do navegador e no anúncio ao leitor de tela */
  rotas: {
    "inicio": { montar: Templates.telaInicio, titulo: "Instituto Semear" },
    "projetos": { montar: Templates.telaProjetos, titulo: "Projetos sociais" },
    "cadastro": { montar: Templates.telaCadastro, titulo: "Cadastro de doadores e voluntários" }
  },

  rotaDesconhecida: { montar: Templates.telaNaoEncontrada, titulo: "Página não encontrada" },

  rotaPadrao: "inicio",

  /* devolve { nome, ancora } a partir de algo como #/projetos/prato-cheio */
  lerEndereco() {
    const bruto = window.location.hash.replace("#/", "").trim();
    if (bruto === "") {
      return { nome: Navegacao.rotaPadrao, ancora: null };
    }
    const partes = bruto.split("/");
    return { nome: partes[0], ancora: partes[1] || null };
  },

  /* desenha a tela correspondente dentro do contêiner da aplicação */
  desenhar() {
    const destino = Navegacao.lerEndereco();
    const rota = Navegacao.rotas[destino.nome] || Navegacao.rotaDesconhecida;

    const app = document.getElementById("app");
    app.innerHTML = rota.montar();

    Navegacao.marcarItemAtivo(destino.nome);
    Navegacao.fecharMenuMobile();
    Navegacao.atualizarTitulo(rota.titulo);
    Navegacao.anunciar(rota.titulo);
    Navegacao.posicionar(destino.ancora);
  },

  /* o título da aba muda junto com a tela, como aconteceria
     numa navegação comum entre páginas */
  atualizarTitulo(titulo) {
    const site = "Instituto Semear";
    document.title = titulo === site ? site : titulo + " | " + site;
  },

  /* numa SPA o navegador não avisa que a página mudou.
     A região aria-live faz esse anúncio ao leitor de tela. */
  anunciar(titulo) {
    const regiao = document.getElementById("anuncio-rota");
    if (regiao) regiao.textContent = titulo;
  },

  /* marca no menu qual é a tela atual */
  marcarItemAtivo(nome) {
    document.querySelectorAll("nav a[data-rota]").forEach(link => {
      if (link.dataset.rota === nome) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },

  /* rola até o projeto escolhido no submenu, ou volta ao topo,
     e leva o foco do teclado para o título da tela nova */
  posicionar(ancora) {
    if (ancora) {
      const alvo = document.getElementById(ancora);
      if (alvo) {
        alvo.scrollIntoView({ behavior: "smooth", block: "start" });
        Navegacao.focarTitulo();
        return;
      }
    }
    window.scrollTo(0, 0);
    Navegacao.focarTitulo();
  },

  /* sem isto o foco continuaria no link do menu, e quem navega
     por teclado recomeçaria do topo a cada troca de tela */
  focarTitulo() {
    const titulo = document.querySelector("#app h1");
    if (!titulo) return;
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
  },

  /* no celular o menu fica aberto pelo checkbox: fecha ao trocar de tela */
  fecharMenuMobile() {
    const alternador = document.getElementById("abrir-menu");
    if (alternador) {
      alternador.checked = false;
    }
  },

  iniciar() {
    window.addEventListener("hashchange", Navegacao.desenhar);

    /* endereço vazio cai na rota padrão */
    if (window.location.hash === "") {
      window.location.hash = "#/" + Navegacao.rotaPadrao;
    } else {
      Navegacao.desenhar();
    }
  }

};

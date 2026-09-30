/* =========================================================
   armazenamento.js — persistência no navegador via localStorage.
   O localStorage guarda apenas texto, então os objetos passam
   por JSON.stringify na ida e JSON.parse na volta.
   ========================================================= */

export const Armazenamento = {

  CHAVE_CADASTROS: "semear:cadastros",
  CHAVE_RASCUNHO: "semear:rascunho",

  /* o localStorage pode estar indisponível em janela anônima
     ou com o armazenamento bloqueado, então tudo passa por try */
  disponivel() {
    try {
      const teste = "semear:teste";
      localStorage.setItem(teste, "1");
      localStorage.removeItem(teste);
      return true;
    } catch (erro) {
      return false;
    }
  },

  ler(chave, padrao) {
    if (!Armazenamento.disponivel()) return padrao;
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? JSON.parse(bruto) : padrao;
    } catch (erro) {
      console.warn("Não foi possível ler", chave, erro);
      return padrao;
    }
  },

  gravar(chave, valor) {
    if (!Armazenamento.disponivel()) return false;
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.warn("Não foi possível gravar", chave, erro);
      return false;
    }
  },

  apagar(chave) {
    if (!Armazenamento.disponivel()) return;
    localStorage.removeItem(chave);
  },

  /* ---------- cadastros enviados ---------- */

  listarCadastros() {
    return Armazenamento.ler(Armazenamento.CHAVE_CADASTROS, []);
  },

  adicionarCadastro(cadastro) {
    const lista = Armazenamento.listarCadastros();
    cadastro.enviadoEm = new Date().toISOString();
    lista.push(cadastro);
    return Armazenamento.gravar(Armazenamento.CHAVE_CADASTROS, lista);
  },

  /* ---------- rascunho do formulário ---------- */

  salvarRascunho(dados) {
    Armazenamento.gravar(Armazenamento.CHAVE_RASCUNHO, dados);
  },

  lerRascunho() {
    return Armazenamento.ler(Armazenamento.CHAVE_RASCUNHO, null);
  },

  limparRascunho() {
    Armazenamento.apagar(Armazenamento.CHAVE_RASCUNHO);
  }

};

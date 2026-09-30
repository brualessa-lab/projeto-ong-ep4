/* =========================================================
   mascaras.js — acoplagem da biblioteca externa IMask.
   A biblioteca escreve a pontuação enquanto a pessoa digita.
   A validação continua nativa (pattern) mais as regras do
   módulo validacao.js; aqui só cuidamos da formatação.
   ========================================================= */

export const Mascaras = {

  /* cada campo do formulário e o formato que ele aceita */
  formatos: {
    cpf: "000.000.000-00",
    telefone: "(00) 00000-0000",
    cep: "00000-000"
  },

  /* guarda as instâncias criadas para desmontar ao trocar de tela */
  instancias: [],

  /* a biblioteca vem de um CDN: se ela falhar, o formulário
     continua funcionando com a validação nativa */
  disponivel() {
    return typeof IMask === "function";
  },

  aplicar() {
    Mascaras.desmontar();

    if (!Mascaras.disponivel()) {
      console.warn("IMask indisponível: os campos seguem aceitando a digitação sem máscara.");
      return;
    }

    Object.keys(Mascaras.formatos).forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        Mascaras.instancias.push(IMask(campo, { mask: Mascaras.formatos[id] }));
      }
    });
  },

  /* a tela de cadastro é recriada a cada visita, e os campos
     antigos deixam de existir: as instâncias velhas são descartadas */
  desmontar() {
    Mascaras.instancias.forEach(instancia => instancia.destroy());
    Mascaras.instancias = [];
  },

  iniciar() {
    window.addEventListener("hashchange", Mascaras.aoTrocarTela);
    Mascaras.aoTrocarTela();
  },

  aoTrocarTela() {
    setTimeout(() => {
      if (document.getElementById("form-cadastro")) {
        Mascaras.aplicar();
      } else {
        Mascaras.desmontar();
      }
    }, 0);
  }

};

/* =========================================================
   validacao.js — regras de consistência dos dados.
   Funções puras: recebem um valor e devolvem verdadeiro ou falso.
   ========================================================= */

export const Validacao = {

  /* mantém só os dígitos de um texto */
  digitos(valor) {
    return valor.replace(/\D/g, "");
  },

  /* CPF: confere os dois dígitos verificadores.
     O pattern do HTML garante o formato; aqui conferimos se o número existe. */
  cpf(valor) {
    const d = Validacao.digitos(valor);

    if (d.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(d)) return false;   /* 111.111.111-11 e afins */

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += Number(d[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(d[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += Number(d[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;

    return resto === Number(d[10]);
  },

  /* celular brasileiro: 11 dígitos e o nono começando em 9 */
  telefone(valor) {
    const d = Validacao.digitos(valor);
    return d.length === 11 && d[2] === "9";
  },

  cep(valor) {
    return Validacao.digitos(valor).length === 8;
  },

  /* idade mínima de 18 anos na data de hoje */
  maiorDeIdade(dataTexto) {
    if (!dataTexto) return false;
    const nascimento = new Date(dataTexto);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 18;
  },

  /* regras extras por campo, aplicadas depois da validação nativa */
  regras: {
    cpf: { testar: v => Validacao.cpf(v), mensagem: "Este CPF não é válido." },
    telefone: { testar: v => Validacao.telefone(v), mensagem: "Informe um celular com DDD e nove dígitos." },
    cep: { testar: v => Validacao.cep(v), mensagem: "O CEP precisa ter oito dígitos." },
    nascimento: { testar: v => Validacao.maiorDeIdade(v), mensagem: "É necessário ter 18 anos ou mais." }
  }

};

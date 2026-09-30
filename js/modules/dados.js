/* =========================================================
   dados.js — conteúdo da aplicação separado da apresentação.
   Alterar um projeto aqui muda a tela inteira, sem tocar no HTML.
   ========================================================= */

export const DADOS = {

  ong: {
    nome: "Instituto Semear",
    resumo: "Educação, alimentação e trabalho para famílias em situação de vulnerabilidade social.",
    apresentacao: "O Instituto Semear é uma organização da sociedade civil sem fins lucrativos. Atuamos em comunidades periféricas com projetos de educação, segurança alimentar e capacitação profissional, mantidos por doações e por trabalho voluntário."
  },

  areas: [
    { titulo: "Educação", texto: "Reforço escolar no contraturno para crianças e adolescentes." },
    { titulo: "Alimentação", texto: "Cozinha comunitária e distribuição de cestas para famílias atendidas." },
    { titulo: "Capacitação profissional", texto: "Cursos gratuitos e encaminhamento de jovens para o mercado de trabalho." }
  ],

  projetos: [
    {
      id: "semear-letras",
      nome: "Semear Letras",
      etiqueta: "Educação",
      classeEtiqueta: "etiqueta-educacao",
      texto: "Reforço escolar no contraturno e biblioteca comunitária para crianças e adolescentes matriculados na rede pública."
    },
    {
      id: "prato-cheio",
      nome: "Prato Cheio",
      etiqueta: "Alimentação",
      classeEtiqueta: "etiqueta-alimentacao",
      texto: "Cozinha comunitária com refeições diárias e distribuição mensal de cestas de alimentos para as famílias atendidas."
    },
    {
      id: "semear-oficios",
      nome: "Semear Ofícios",
      etiqueta: "Capacitação",
      classeEtiqueta: "etiqueta-capacitacao",
      texto: "Cursos profissionalizantes gratuitos para jovens, com encaminhamento para vagas em empresas parceiras."
    }
  ],

  participacao: [
    {
      titulo: "Como doar",
      texto: "As doações sustentam as refeições, o material escolar e os cursos. A contribuição pode ser única ou mensal, e o doador escolhe no cadastro qual projeto receberá o valor.",
      itens: [
        "Doação única ou mensal",
        "Escolha do projeto que receberá o valor",
        "Relatório de prestação de contas enviado a quem doa"
      ],
      chamada: "Cadastre-se como doador"
    },
    {
      titulo: "Como ser voluntário",
      texto: "O trabalho voluntário acontece nas unidades dos três projetos, em turnos semanais. Não é preciso experiência prévia: toda pessoa passa por uma formação inicial gratuita antes de começar.",
      itens: [
        "Turnos semanais combinados com a coordenação",
        "Formação inicial gratuita",
        "Atuação no projeto de sua preferência"
      ],
      chamada: "Cadastre-se como voluntário"
    }
  ],

  contato: {
    email: "contato@example.org",
    telefone: "(11) 99999-9999",
    telefoneLink: "+5511999999999"
  },

  estados: [
    ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
    ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"],
    ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"],
    ["MG", "Minas Gerais"], ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"],
    ["PE", "Pernambuco"], ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
    ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"],
    ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"]
  ]

};

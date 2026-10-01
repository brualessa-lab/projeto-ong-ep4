# Instituto Semear

Plataforma web de uma organização do terceiro setor, construída como aplicação de página única (SPA) em JavaScript, sem framework.

O site apresenta a ONG, divulga os projetos sociais e recebe cadastros de doadores e voluntários, com validação e persistência no próprio navegador.

**Site publicado:** https://brualessa-lab.github.io/projeto-ong-ep4/

> Projeto acadêmico. O Instituto Semear é uma organização fictícia, e os dados de contato usam o domínio `example.org`, reservado para documentação.

---

## Índice

- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como executar localmente](#como-executar-localmente)
- [Build de produção](#build-de-produção)
- [Deploy](#deploy)
- [Como a aplicação funciona](#como-a-aplicação-funciona)
- [Acessibilidade](#acessibilidade)
- [Fluxo de versionamento](#fluxo-de-versionamento)
- [Padrão de commits](#padrão-de-commits)
- [Manutenção](#manutenção)

---

## Tecnologias

| Recurso | Uso no projeto |
|---|---|
| HTML5 semântico | Casca da aplicação e marcação gerada pelos templates |
| CSS3 | Design system com 25 variáveis, CSS Grid de 12 colunas, Flexbox e 5 pontos de quebra |
| JavaScript (ES Modules) | 1.114 linhas em 11 arquivos, sem framework |
| [IMask 7.6.1](https://imask.js.org/) | Máscaras de CPF, telefone e CEP, carregada por CDN |
| [Vite 7](https://vite.dev/) | Empacotamento e minificação do build de produção |
| [sharp](https://sharp.pixelplumbing.com/) | Conversão das imagens para WebP |
| GitHub Actions | Build e publicação automáticos |
| GitHub Pages | Hospedagem |

Vite e sharp são dependências de desenvolvimento: entram apenas na geração do build. O código que vai para o navegador continua sem framework.

---

## Estrutura de pastas

```
projeto-ong-ep4/
├── html/
│   └── index.html          Casca da SPA: cabeçalho, menu, <main> vazio e rodapé
├── css/
│   └── estilo.css          Design system e todas as regras visuais
├── js/
│   ├── main.js             Ponto de entrada: liga os módulos ao carregar
│   └── modules/
│       ├── dados.js        Conteúdo da ONG, projetos e lista de estados
│       ├── templates.js    Funções que geram o HTML de telas e componentes
│       ├── navegacao.js    Roteador por hash e troca de telas
│       ├── modal.js        Abertura e fechamento do modal
│       ├── validacao.js    Regras de consistência (CPF, telefone, CEP, idade)
│       ├── armazenamento.js  Leitura e gravação no localStorage
│       ├── formulario.js   Eventos e envio do cadastro
│       ├── mascaras.js     Acoplagem da biblioteca IMask
│       ├── menu.js         Abertura do menu no celular
│       └── tema.js         Alternância entre o tema claro e o escuro
├── imagens/
│   ├── logo-instituto-semear.png   Reserva, para navegadores sem WebP
│   └── logo-instituto-semear.webp  Servido aos navegadores atuais
├── .github/
│   └── workflows/
│       └── deploy.yml      Build e publicação automáticos no Pages
├── vite.config.js          Configuração do empacotador
├── converter-imagens.mjs   Geração dos arquivos WebP
└── package.json            Dependências e comandos
```

A pasta `dist/`, criada pelo build, fica fora do versionamento: o conteúdo dela é gerado de novo a cada publicação.

Cada pasta guarda um tipo de arquivo, e cada módulo trata de um assunto só. Nenhum módulo invade a responsabilidade do vizinho: o `formulario.js` nunca chama `localStorage` diretamente, e o `validacao.js` nunca desenha nada na tela.

---

## Como executar localmente

A aplicação usa ES Modules (`import` / `export`), e o navegador bloqueia esse carregamento quando o arquivo é aberto direto do disco, por política de CORS. **É necessário servir a pasta por HTTP.**

### Com o Vite

```bash
npm install
npm run dev
```

O endereço aparece no terminal, e o navegador recarrega sozinho a cada arquivo salvo.

### Sem instalar nada

Qualquer servidor estático serve o código-fonte como está, porque a aplicação não depende de nenhuma etapa de compilação para funcionar:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000/html/index.html`.

A única dependência externa, a IMask, vem de CDN e exige conexão com a internet. Sem ela, o formulário continua funcionando: a validação é nativa, e apenas a pontuação deixa de ser escrita automaticamente.

---

## Build de produção

```bash
npm run build
```

O comando faz duas coisas. Primeiro o `converter-imagens.mjs` gera a versão WebP de cada PNG da pasta `imagens`. Depois o Vite junta os módulos JavaScript num arquivo só, minifica o CSS e escreve tudo em `dist/`, com um resumo do conteúdo no nome dos arquivos para o cache do navegador saber quando algo mudou.

| Recurso | Antes | Depois |
|---|---|---|
| CSS | 17.965 bytes | 10.934 bytes |
| JavaScript | 38.044 bytes em 10 arquivos | 20.257 bytes em 1 arquivo |
| Logotipo | 6.924 bytes | 2.006 bytes |
| Requisições | 13 | 4 |

Para conferir o resultado antes de publicar:

```bash
npm run preview
```

---

## Deploy

A publicação é automática. Todo push na `main` dispara o workflow `.github/workflows/deploy.yml`, que instala as dependências com `npm ci`, roda o build e envia a pasta `dist/` para o GitHub Pages.

O Pages está configurado com a origem **GitHub Actions**, e não com uma branch. Por isso o endereço publicado aponta direto para a raiz do site, sem `/html/` no caminho.

A aba **Actions** do repositório mostra cada publicação, com o registro de cada etapa. Um build que falhe interrompe o processo antes de publicar, e o site no ar continua sendo o da última versão que passou.

Para publicar fora de um push, a mesma aba oferece o botão **Run workflow**.

---

## Como a aplicação funciona

### Navegação

O roteador lê o trecho do endereço depois do `#` e desenha a tela correspondente dentro de `<main id="app">`, sem recarregar a página.

| Endereço | Tela |
|---|---|
| `#/inicio` | Apresentação da ONG |
| `#/projetos` | Projetos sociais e formas de participar |
| `#/projetos/<id>` | Projetos, rolando até o projeto indicado |
| `#/cadastro` | Formulário de doadores e voluntários |
| qualquer outro | Tela de página não encontrada |

O evento `hashchange` dispara a troca. Endereços inválidos caem numa tela própria, em vez de quebrar.

### Telas geradas por template

Nenhuma tela existe pronta no HTML. Cada componente é uma função que recebe dados e devolve marcação, e as funções se combinam — a etiqueta é montada dentro do cartão, que é montado dentro da tela.

### Formulário

- **Validação nativa**: `required`, `type`, `minlength`, `maxlength`, `min`, `max` e `pattern`
- **Regras próprias** em `validacao.js`: dígitos verificadores do CPF, formato de celular, CEP e idade mínima de 18 anos
- **Feedback**: o campo é validado ao perder o foco, a mensagem aparece abaixo dele e o campo recebe `aria-invalid`
- **Máscaras**: CPF, telefone e CEP são formatados durante a digitação; os três também aceitam apenas números, porque o teclado numérico do celular não tem tecla de pontuação

### Dados guardados no navegador

| Chave | Conteúdo |
|---|---|
| `semear:cadastros` | Lista dos cadastros enviados |
| `semear:rascunho` | Preenchimento em andamento, regravado a cada tecla |

Os cadastros aparecem na seção "Cadastros neste navegador", ao fim da tela de cadastro, e sobrevivem ao fechamento da aba. O rascunho é devolvido aos campos ao voltar para a tela, e apagado depois do envio.

Todo acesso ao `localStorage` passa por `try/catch`: em janela anônima ou com armazenamento bloqueado, a aplicação avisa em vez de falhar em silêncio.

---

## Acessibilidade

- Marcação semântica: `header`, `nav`, `main`, `section`, `article`, `footer`, `address`
- Um `h1` por tela, com hierarquia de títulos sem pular níveis
- `alt` descritivo nas imagens e `label` associado a todos os campos
- Contraste conferido pela WCAG: texto a 17:1, texto de apoio a 11,8:1, bordas de campo a 3,4:1
- Foco visível pelo teclado, com `:focus-visible`
- Na troca de tela: o foco vai para o `h1`, uma região `aria-live` anuncia a mudança e o título da aba é atualizado
- O menu funciona por teclado, e o submenu abre também por `:focus-within`
- Link de atalho para saltar a navegação, visível ao receber foco
- Modal com `role="dialog"`, foco preso enquanto aberto e devolvido ao fechar
- Botão do menu com `aria-expanded` e `aria-controls`

### Verificação com leitor de tela

A navegação foi percorrida com o Narrador do Windows, no site publicado, em quatro pontos:

| O que foi verificado | Resultado |
|---|---|
| Link de atalho | Primeira parada do `Tab`, anunciado como link |
| Troca de tela | O nome da tela nova é lido sozinho, pela região `aria-live` |
| Modal | Anunciado como caixa de diálogo, com o `Tab` circulando dentro dele e `Esc` devolvendo o foco |
| Botão de tema | O estado pressionado é falado, pelo `aria-pressed` |

Numa SPA a página nunca recarrega, então o navegador não avisa que a tela mudou. O segundo item é o que confirma que a região `aria-live` cobre essa lacuna.

### Tema claro e escuro

A aplicação segue por padrão a preferência do sistema operativo, lida pelo CSS com `prefers-color-scheme`. O botão no cabeçalho permite escolher manualmente, e a escolha é guardada no `localStorage` em `semear:tema`, passando a valer nas visitas seguintes.

A troca é feita apenas por variáveis: os mesmos nomes recebem valores novos, e nenhuma regra de layout muda. Os dois temas foram medidos pela WCAG — no escuro, o texto fica em 16,2:1 e as cores de apoio acima de 8:1.

---

## Fluxo de versionamento

O repositório segue o GitFlow.

| Branch | Papel |
|---|---|
| `main` | Somente versões em produção. Cada push aqui dispara o deploy |
| `develop` | Integração do trabalho em andamento. Branch padrão do repositório |
| `feature/*` | Uma funcionalidade nova, criada a partir de `develop` |
| `fix/*` | Correção de defeito |
| `hotfix/*` | Correção urgente aplicada a partir de `main` |

Nenhum commit vai direto para `main` ou `develop`: toda mudança nasce numa branch própria e volta por pull request.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade
# ... trabalho e commits ...
git push -u origin feature/nome-da-funcionalidade
# abrir o pull request para develop
```

---

## Padrão de commits

Mensagens seguem o padrão semântico: um prefixo indicando o tipo, um título curto, e um corpo explicando o motivo quando a mudança pede.

| Prefixo | Quando usar |
|---|---|
| `feat` | Funcionalidade nova |
| `fix` | Correção de defeito |
| `docs` | Documentação |
| `style` | Formatação, sem mudar comportamento |
| `refactor` | Reorganização de código |
| `perf` | Desempenho |
| `build` | Build, minificação, dependências |
| `chore` | Manutenção geral |

Exemplo:

```
fix: remove o contorno do título no foco por código

O título da tela recebe foco a cada troca de rota para orientar o
leitor de tela. O navegador desenhava o contorno padrão nesse foco
programático, o que poluía a interface.
```

---

## Manutenção

### Mudar textos, projetos ou áreas de atuação

Tudo está em `js/modules/dados.js`. Alterar o nome de um projeto ali muda o cartão e o submenu ao mesmo tempo.

Para acrescentar um projeto, basta um objeto novo no array `projetos`:

```js
{
  id: "novo-projeto",
  nome: "Nome do Projeto",
  etiqueta: "Educação",
  classeEtiqueta: "etiqueta-educacao",
  texto: "Descrição do projeto."
}
```

O cartão, a etiqueta e o item do submenu aparecem sozinhos.

### Mudar cores, tamanhos ou espaçamentos

Todas as 25 variáveis ficam no bloco `:root`, no começo de `css/estilo.css`. Trocar `--cor-primaria` repinta a aplicação inteira.

Ao escolher cores novas, confira o contraste: a WCAG pede no mínimo 4,5:1 para texto e 3:1 para bordas de campo.

### Acrescentar uma tela

1. Escreva a função que monta o HTML em `js/modules/templates.js`
2. Registre a rota em `js/modules/navegacao.js`, no objeto `rotas`, com a função e o título
3. Acrescente o link no menu, em `html/index.html`, com o atributo `data-rota`

### Acrescentar uma regra de validação

Em `js/modules/validacao.js`, inclua a função de teste e registre no objeto `regras`, usando o `name` do campo como chave:

```js
regras: {
  meu_campo: { testar: v => minhaFuncao(v), mensagem: "Mensagem de erro." }
}
```

O formulário passa a aplicá-la sem nenhuma outra alteração.

### Atualizar a biblioteca externa

A versão está fixada em `html/index.html`. Trocar o número no endereço do CDN atualiza a biblioteca; teste as três máscaras depois de qualquer mudança.

---

## Validação técnica

HTML e CSS validados sem erros nem avisos:

- [W3C Markup Validation Service](https://validator.w3.org/)
- [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/)

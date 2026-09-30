/* =========================================================
   templates.js — funções que devolvem HTML a partir dos dados.
   Cada componente visual vira uma função reaproveitável.
   ========================================================= */

import { DADOS } from "./dados.js";
import { Armazenamento } from "./armazenamento.js";

export const Templates = {

  /* ---------- componentes reaproveitáveis ---------- */

  etiqueta(texto, classe) {
    return `<span class="etiqueta ${classe}">${texto}</span>`;
  },

  alerta(texto, tipo) {
    return `<p class="alerta alerta-${tipo}">${texto}</p>`;
  },

  cartaoProjeto(projeto) {
    return `
      <article id="${projeto.id}">
        <h3>${projeto.nome}</h3>
        ${Templates.etiqueta(projeto.etiqueta, projeto.classeEtiqueta)}
        <p>${projeto.texto}</p>
      </article>`;
  },

  cartaoArea(area) {
    return `
      <section>
        <h3>${area.titulo}</h3>
        <p>${area.texto}</p>
      </section>`;
  },

  blocoParticipacao(bloco) {
    const itens = bloco.itens.map(i => `<li>${i}</li>`).join("");
    return `
      <section class="col-6">
        <h2>${bloco.titulo}</h2>
        <p>${bloco.texto}</p>
        <ul>${itens}</ul>
        <p><a href="#/cadastro">${bloco.chamada}</a>.</p>
      </section>`;
  },

  campo(config) {
    const atributos = Object.keys(config.atributos)
      .map(a => `${a}="${config.atributos[a]}"`)
      .join(" ");
    return `
      <p>
        <label for="${config.id}">${config.rotulo}</label>
        <input id="${config.id}" name="${config.id}" ${atributos}>
      </p>`;
  },

  /* ---------- telas da aplicação ---------- */

  telaInicio() {
    const areas = DADOS.areas.map(Templates.cartaoArea).join("");
    const c = DADOS.contato;
    return `
      <h1>${DADOS.ong.nome}</h1>
      <p>${DADOS.ong.resumo}</p>

      <section>
        <h2>Quem somos</h2>
        <p>${DADOS.ong.apresentacao}</p>
      </section>

      <section class="grade-cards">
        <h2>Áreas de atuação</h2>
        ${areas}
      </section>

      <section class="col-8">
        <h2>Como participar</h2>
        <p>
          Conheça as <a href="#/projetos">iniciativas solidárias</a> em andamento ou
          <a href="#/cadastro">cadastre-se como doador ou voluntário</a>.
        </p>
      </section>

      <section class="col-4 bloco-destaque">
        <h2>Contato</h2>
        <address>
          E-mail: <a href="mailto:${c.email}">${c.email}</a><br>
          Telefone: <a href="tel:${c.telefoneLink}">${c.telefone}</a>
        </address>
      </section>`;
  },

  telaProjetos() {
    const cartoes = DADOS.projetos.map(Templates.cartaoProjeto).join("");
    const blocos = DADOS.participacao.map(Templates.blocoParticipacao).join("");
    return `
      <h1>Projetos sociais</h1>
      <p>As iniciativas solidárias mantidas pelo Instituto Semear e as formas de participar delas.</p>
      ${Templates.alerta("Os três projetos estão com inscrições abertas para novos voluntários.", "sucesso")}

      <section class="grade-cards">
        <h2>Projetos em andamento</h2>
        ${cartoes}
      </section>
      ${blocos}`;
  },

  telaCadastro() {
    const estados = DADOS.estados
      .map(uf => `<option value="${uf[0]}">${uf[1]}</option>`)
      .join("");

    const dadosPessoais = [
      { id: "nome", rotulo: "Nome completo", atributos: { type: "text", required: "", minlength: "5", maxlength: "80", autocomplete: "name", placeholder: "Maria Souza da Silva" } },
      { id: "cpf", rotulo: "CPF", atributos: { type: "text", required: "", maxlength: "14", pattern: "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}", inputmode: "numeric", placeholder: "000.000.000-00", title: "Digite o CPF com ou sem pontuação" } },
      { id: "nascimento", rotulo: "Data de nascimento", atributos: { type: "date", required: "", autocomplete: "bday", min: "1920-01-01", max: "2008-12-31" } }
    ].map(Templates.campo).join("");

    const contato = [
      { id: "email", rotulo: "E-mail", atributos: { type: "email", required: "", autocomplete: "email", placeholder: "nome@exemplo.com" } },
      { id: "telefone", rotulo: "Telefone celular", atributos: { type: "tel", required: "", autocomplete: "tel", pattern: "\\(?\\d{2}\\)?\\s?\\d{5}-?\\d{4}", inputmode: "tel", placeholder: "(11) 90000-0000", title: "Digite o telefone com ou sem pontuação" } },
      { id: "cep", rotulo: "CEP", atributos: { type: "text", required: "", autocomplete: "postal-code", maxlength: "9", pattern: "\\d{5}-?\\d{3}", inputmode: "numeric", placeholder: "00000-000", title: "Digite o CEP com ou sem hífen" } },
      { id: "endereco", rotulo: "Endereço", atributos: { type: "text", required: "", maxlength: "120", autocomplete: "address-line1", placeholder: "Rua, número e complemento" } },
      { id: "cidade", rotulo: "Cidade", atributos: { type: "text", required: "", maxlength: "60", autocomplete: "address-level2" } }
    ].map(Templates.campo).join("");

    return `
      <h1>Cadastro de doadores e voluntários</h1>
      <p>Preencha o formulário para apoiar o Instituto Semear. Todos os campos são obrigatórios.</p>
      ${Templates.alerta('Seus dados servem apenas para contato institucional. <a href="#" data-abrir-modal="modal-dados">Saiba como usamos seus dados</a>.', "info")}

      <section>
        <h2>Formulário de cadastro</h2>

        <form id="form-cadastro">

          <fieldset>
            <legend>Dados pessoais</legend>
            ${dadosPessoais}
          </fieldset>

          <fieldset>
            <legend>Contato e endereço</legend>
            ${contato}
            <p>
              <label for="estado">Estado</label>
              <select id="estado" name="estado" required autocomplete="address-level1">
                <option value="">Selecione o estado</option>
                ${estados}
              </select>
            </p>
          </fieldset>

          <fieldset>
            <legend>Forma de participação</legend>
            <p class="opcao">
              <input type="radio" id="tipo-doador" name="tipo" value="doador" required>
              <label for="tipo-doador">Doador</label>
            </p>
            <p class="opcao">
              <input type="radio" id="tipo-voluntario" name="tipo" value="voluntario">
              <label for="tipo-voluntario">Voluntário</label>
            </p>
          </fieldset>

          <p><button type="submit">Enviar cadastro</button></p>

        </form>
      </section>

      <section>
        <h2>Cadastros neste navegador</h2>
        <div id="historico">${Templates.historico()}</div>
      </section>`;
  },

  /* lista os cadastros guardados no navegador */
  historico() {
    const lista = Armazenamento.listarCadastros();

    if (lista.length === 0) {
      return `<p>Nenhum cadastro guardado neste navegador ainda.</p>`;
    }

    const itens = lista.map(c => {
      const data = new Date(c.enviadoEm).toLocaleDateString("pt-BR");
      const papel = c.tipo === "doador" ? "Doador" : "Voluntário";
      return `<li>${c.nome} — ${papel} — ${c.cidade}/${c.estado} — ${data}</li>`;
    }).join("");

    return `
      <ul>${itens}</ul>
      <p><button type="button" id="limpar-historico">Apagar os cadastros deste navegador</button></p>`;
  },

  /* ---------- componentes fixos da casca ---------- */

  modalDados() {
    return `
      <div id="modal-dados" class="modal">
        <section class="modal-caixa">
          <h2>Como usamos seus dados</h2>
          <p>
            Os dados do cadastro ficam com a equipe do Instituto Semear e servem para
            enviar a prestação de contas aos doadores e para combinar os turnos com os
            voluntários.
          </p>
          <p>Para sair do cadastro, basta responder ao e-mail de confirmação.</p>
          <button type="button" class="modal-fechar">Fechar</button>
        </section>
      </div>`;
  },

  telaNaoEncontrada() {
    return `
      <h1>Página não encontrada</h1>
      <p>O endereço digitado não corresponde a nenhuma tela da aplicação.</p>
      ${Templates.alerta("Use o menu acima para voltar à navegação.", "erro")}`;
  }

};

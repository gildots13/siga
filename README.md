# SIGA - Sistema Integrado de Gestão de Atendimento

Protótipo Front-end para organizar a emissão de senhas, a fila de espera, as chamadas e o histórico de atendimento de um laboratório de análises clínicas.

## Entrega atual

Esta versão corresponde à **AV1** da disciplina de Front-end Frameworks. Os dados são locais e as alterações relevantes são persistidas no `localStorage`. A integração com API e a autenticação estão planejadas para a AV2.

## Problema e público

O SIGA reduz a desorganização no atendimento presencial e oferece uma visão única do fluxo da unidade. O sistema atende quatro públicos:

- pacientes que emitem e acompanham uma senha;
- atendentes que chamam e concluem atendimentos;
- responsáveis pela unidade que acompanham os indicadores;
- público da recepção que visualiza as chamadas em um painel.

## Funcionalidades da AV1

- emissão de senhas nos tipos **SP** (prioritário), **SG** (geral) e **SE** (entrega de resultados);
- numeração diária no padrão `AAMMDD-TIPO-NÚMERO`, por exemplo `260927-SP001`;
- terminal com configuração do atendente e do guichê;
- chamada, segunda chamada, início e finalização do atendimento;
- registro de não comparecimento após a segunda chamada;
- alternância simplificada entre senhas prioritárias e as demais;
- painel público com a senha atual e as cinco chamadas anteriores;
- visão geral com indicadores e distribuição da fila;
- histórico pesquisável e filtrável por tipo e situação;
- persistência das senhas e do posto de atendimento no navegador;
- estados vazios, validação de formulário e mensagens de resultado;
- layout responsivo para computadores, tablets e celulares.

## Rotas

| Rota | Finalidade |
|---|---|
| `/inicio` | Indicadores e acessos rápidos |
| `/atendimento` | Terminal operacional do atendente |
| `/historico` | Consulta e filtros dos registros |
| `/totem` | Emissão de novas senhas |
| `/painel` | Painel público de chamadas |

## Tecnologias

- React 19 com componentes funcionais;
- JavaScript;
- Vite;
- React Router;
- CSS tradicional e responsivo;
- `localStorage` para persistência da AV1.

## Como executar

Requisitos: Node.js 20 ou superior e npm.

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço informado pelo Vite no terminal.

### Verificações

```bash
npm run lint
npm run build
```

## Dados e persistência

A base inicial fica em `frontend/src/data/initialData.js`. Na primeira execução, ela apresenta registros de demonstração do dia. Após qualquer operação, o sistema grava os dados nas chaves:

- `siga:tickets:v1`: senhas e movimentações;
- `siga:attendant-profile:v1`: nome do atendente e guichê.

A opção **Restaurar demonstração**, disponível no histórico, recupera a base inicial. A sincronização entre abas abertas no mesmo navegador usa o evento `storage`.

## Regra de chamada

As senhas são ordenadas pelo horário de emissão. Quando a chamada anterior foi prioritária, o sistema procura a próxima senha geral ou de entrega de resultados. Nos demais casos, procura primeiro a senha prioritária. Se a fila preferencial estiver vazia, chama a senha mais antiga disponível.

## Organização

```text
frontend/src/
├── components/   componentes reutilizáveis e estrutura do sistema
├── context/      provedor do estado da fila
├── data/         base local e definições do domínio
├── hooks/        acesso ao contexto
├── pages/        páginas associadas às rotas
├── utils/        formatação de datas e durações
├── App.jsx       configuração das rotas
└── App.css       identidade visual e responsividade
```

## Equipe e contribuições

Antes da entrega, preencher esta tabela com os nomes e as contribuições reais registradas nos commits.

| Integrante | Contribuição principal |
|---|---|
| GILDO JUNIOR DA SILVA - 01956945 | Totem e emissão de senhas de atendimento |
| Carlos Henrique do Monte - 01803176  | Terminal e fluxo de atendimento pelo lado do usuário e do atendente |
| Caio Henrique Melo Diniz - 01847836 | Painel público e visão geral, componentes de front-end e estruturaçãode rotas, conjunto com mais um integrante |
| Ruben Marques de Souza Barbosa - 01849527 | Histórico, filtros e documentação e estruturação de rotas |

## Evolução planejada para a AV2

- substituir a fonte local pela API aprovada do projeto de Back-end;
- implementar login, restauração da sessão, logout e rota protegida;
- concentrar as requisições com `fetch` em `src/services`;
- apresentar carregamento, sucesso, vazio, erro e ação de tentar novamente;
- tratar respostas `401` e `403`;
- manter dados locais compatíveis como contingência para a apresentação.

## Limitações da AV1

- os dados existem apenas no navegador em que foram criados;
- não há controle de concorrência entre vários computadores;
- não existe autenticação nesta etapa;
- a impressão usa a caixa de diálogo padrão do navegador.

## Uso de inteligência artificial

Ferramentas de inteligência artificial foram usadas como apoio na estruturação da interface, revisão de código e documentação. Minha equipe, os 4Devs, permanece responsável por revisar, testar e explicar todo o conteúdo entregue.

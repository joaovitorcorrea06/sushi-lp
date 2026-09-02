# Sushi Lounge

> Landing page premium e white-label para restaurantes japoneses.

Uma experiencia digital com direcao visual escura, detalhes quentes, cenas 3D e transicoes suaves. A base foi pensada para ser adaptada rapidamente para uma marca, cidade e operacao de restaurante especificas.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=061017)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-000000?logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/status-template-F49B38)

## O que esta incluso

- Hero imersivo com modelo 3D de sushi e resposta ao scroll.
- Narrativa editorial para destacar experiencia, menu, ambiente e contato.
- Galeria visual, depoimentos, FAQ e secoes de conversao.
- Animacoes de entrada com suporte a `prefers-reduced-motion`.
- Layout responsivo para desktop e mobile.
- Conteudo centralizado em um unico arquivo para personalizacao rapida.

## Tecnologias

| Area | Stack |
| --- | --- |
| Interface | React 19 + Vite 7 |
| Estilos | Tailwind CSS 4 |
| Animacao | Motion + GSAP |
| Cena 3D | Three.js, React Three Fiber e Drei |
| Icones | Lucide React |

## Comecar

### Pre-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

### Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereco informado pelo Vite, normalmente `http://localhost:5173`.

### Gerar build de producao

```bash
npm run build
npm run preview
```

## Personalizacao

O conteudo comercial esta concentrado em [`src/config/landing-content.js`](src/config/landing-content.js). Atualize ali:

- `brand`, titulos e textos da hero.
- CTAs, links de WhatsApp e mapa.
- Dados de contato, endereco e horarios.
- Destaques, menu, depoimentos e perguntas frequentes.

Para apontar o botao para WhatsApp, use uma URL completa:

```js
primaryCta: {
  label: "Reservar pelo WhatsApp",
  href: "https://wa.me/5500000000000?text=Ola%2C%20quero%20fazer%20uma%20reserva.",
},
```

Links iniciados por `#` permanecem na propria pagina; links externos abrem em uma nova aba automaticamente.

## Ativos visuais

| Caminho | Uso |
| --- | --- |
| `public/images/` | Ilustracoes editoriais do menu, ambiente e atendimento. |
| `public/models/sushi_nigiri_salmon.glb` | Modelo 3D usado nas cenas principais. |
| `public/favicon.svg` | Icone generico da aplicacao. |

As referencias de imagens e do modelo 3D tambem ficam em [`src/config/landing-content.js`](src/config/landing-content.js). Ao substituir os arquivos, mantenha os caminhos atualizados no objeto de conteudo.

## Estrutura

```text
src/
  config/landing-content.js   Conteudo e configuracoes da landing
  pages/LandingPage.jsx       Estrutura principal da pagina
  features/hero/HeroScene.jsx Cena 3D e comportamento de scroll
  components/                 Componentes reutilizaveis
  styles.css                  Tokens e estilos globais
public/
  images/                     Ativos visuais
  models/                     Modelos 3D
```

## Scripts

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Cria a versao otimizada para producao. |
| `npm run preview` | Serve localmente o build de producao. |

---

Feito para transformar a primeira impressao de um restaurante em uma experiencia memoravel.

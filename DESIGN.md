# Direção visual — Batalha dos Piratas

Direção aprovada pelo usuário em 16/10/2026: **volume cartoon 3D do navio marrom com ondas, combinado com cores e detalhes do galeão vermelho**. A referência executável é `arte/conceitos/galeao-misto-3d-vermelho.png`, aprovada com “ficou bem melhor, siga nessa linha”.

## Público e intenção

Jogo de aventura para Albert brincar com seu sobrinho Bryan. Nomes sugeridos: **Capitão Bryan** e **Capitão Albert**. Os diálogos preservam quem já digitou o título, sem repetir “Capitão Capitão”.

## Materiais e cores

Casco arredondado com tábuas de madeira marrom, painéis pintados, latão espesso, canhões grandes de metal escuro, velas cheias com dobras e iluminação de animação 3D. Madeira aparente com sulcos simplificados; detalhes desenhados para leitura em miniatura, sem envelhecimento fotográfico. Caveiras e cordame fazem parte do mundo pirata de aventura inspirado em One Piece.

- Oceano: `--deep: #0b6287`, `--sea: #169db6`, `--sea2: #43c7dc`.
- Latão e ações: `--gold: #f4c768`.
- Texto: `--ink: #293b4b`; papel: `--cream: #fff3d3`.
- Vermelho: `--red: #ba352b`; madeira: `--wood: #7c4527`.
- Painéis usam molduras de madeira, rebites de latão, papel creme e volume discreto.

A proposta deve manter volume 3D, cores vivas e caráter de aventura. Não voltar à ilustração plana com contornos pesados, ao navio histórico realista ou às proporções de brinquedo de bebê com rostos de bichinhos no casco.

## Artes

Oito imagens atuais em `arte/aventura/`. O galeão usa a própria amostra aprovada, sem nova geração. As demais peças foram criadas com Imagegen usando essa amostra como referência direta. WebP com transparência nos objetos; cenário opaco. Prompts e origens em `docs/art-provenance-aventura.json`.

Frota de cinco artes distintas: galeão vermelho (5 casas), fragata azul (4), bergantim verde (3), escuna de velas claras (3), bote vermelho compacto (2). Mesma madeira, latão e canhões com volume em todos. Papagaio, baú e enseada seguem o mesmo acabamento.

Versões anteriores em `arte/3d/`, `arte/cartoon/` e outras amostras em `arte/conceitos/` permanecem preservadas e não são carregadas no jogo.

## Interface e proporções

Luckiest Guy nos títulos e ações principais, Nunito nas instruções e campos. Corpo 16 px, instruções 14 px, texto secundário a partir de 11 px. Campos de texto com pelo menos 16 px e foco visível.

No computador, título e navio ficam à esquerda, preparação à direita. No celular, título, navio e preparação seguem nessa ordem. A área da ilustração cresceu para exibir as velas da amostra aprovada. O mapa de ataque mantém prioridade na batalha; frota própria e resumo ficam abaixo no celular. As coordenadas e o número de casas da lógica permanecem estáveis.

## Movimento

- Balanço suave do navio no início e reflexos discretos na água.
- Bala grande em arco de 540 ms; impacto com clarão de volume, fumaça, partículas e “BUM!”. Erro com gotas, anéis e “SPLASH!”. Palavras decorativas, com resultado narrado no texto acessível.
- Afundamento usa a mesma arte do navio, com impactos, bolhas, inclinação e submersão; sobra uma silhueta submersa.
- Interface com transições de 120–250 ms, curva `cubic-bezier(.23,1,.32,1)`.
- Redução de movimento remove arco, deslocamentos, palavras flutuantes e balanço, mantendo confirmação por opacidade. Mudanças na preferência do sistema são acompanhadas durante o jogo.
- CSS e Web Animations API, sem biblioteca adicional.

## Validação

Script `scripts/verify-game.cjs`: posicionamento, rotação, partida local completa, vitória, troca de turno, redução de movimento e sincronização entre duas abas. Capturas e relatório em `docs/review/`. Layouts também conferidos em larguras de 320 a 1366 px. Transporte entre abas não equivale a teste WebRTC entre aparelhos físicos; a revisão responsiva não equivale a teste em Android/iOS real.

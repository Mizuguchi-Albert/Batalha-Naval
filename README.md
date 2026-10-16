# Batalha dos Piratas

Batalha naval infantil com tema pirata para jogar com a família, direto no navegador.

**Jogar:** https://mizuguchi-albert.github.io/Batalha-Naval/

- **Mesmo aparelho:** dois capitães passando o aparelho a cada turno.
- **Dois aparelhos:** um capitão cria a sala e passa o código de 4 letras; o outro digita o código no seu aparelho. A conexão é direta entre os aparelhos (WebRTC via PeerJS) e cada frota fica só no aparelho do dono.
- Cinco navios com volume cartoon 3D, madeira aparente, detalhes dourados e canhões grandes; papagaio, tesouro e cenário no mesmo estilo de aventura. Nomes sugeridos: Capitão Bryan e Capitão Albert.
- Tiros de canhão em arco, respingos, explosões de gibi com “BUM!”/“SPLASH!” e afundamento animado.
- Respeita a preferência de redução de movimento do sistema.

## Desenvolvimento local

Sem build. Na pasta do projeto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173`. Para testar dois jogadores em duas abas do mesmo navegador, abra o jogo com `#teste` no fim do endereço.

## Verificação

Com Playwright e Google Chrome disponíveis e o servidor iniciado:

```sh
node scripts/verify-game.cjs
```

`BASE_URL` muda o endereço, `REVIEW_DIR` muda a pasta de capturas e `BROWSER_CHANNEL` muda o canal de navegador. O script verifica posicionamento, rotação, partida local completa, vitória, redução de movimento e sincronização entre duas abas. O transporte de teste não valida a conexão PeerJS entre aparelhos reais.

Artes atuais em `arte/aventura/`, procedência e prompts em `docs/art-provenance-aventura.json`, decisões visuais em `DESIGN.md`. As capturas de revisão e o relatório estão em `docs/review/`. A amostra aprovada está em `arte/conceitos/galeao-misto-3d-vermelho.png`. As explorações visuais anteriores ficam preservadas localmente; os SVGs originais continuam no repositório.

## Surpresas

- **Bala tripla:** cada capitão começa com uma; ela atinge três casas lado a lado.
- **Tesouro escondido:** cada mar tem um baú numa casa de água; quem acha ganha mais uma bala tripla e outro tiro.
- **Kraken:** depois de 4 tiros na água seguidos, o Kraken aparece e marca uma área 3×3 com um pedaço de navio.
- **Batizar os navios:** cada capitão pode dar nome aos seus navios; o papagaio usa os nomes.

## Som

Música (Drunken Sailor, canção tradicional) e efeitos gerados com Web Audio, sem arquivos. Botões no topo ligam e desligam música e efeitos.

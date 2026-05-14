const BASE = 'https://pokeapi.co/api/v2';

let todosPokemons = [];

let pokemonsFiltrados = [];

async function carregarInicial() {

  mostrarLoading();

  const res = await fetch(`${BASE}/pokemon?limit=151`);

  const data = await res.json();

  const promessas = data.results.map(p =>
    fetch(p.url).then(r => r.json())
  );

  todosPokemons = await Promise.all(promessas);

  pokemonsFiltrados = [...todosPokemons];

  renderizar(pokemonsFiltrados);
}

function renderizar(lista) {

  const grid = document.getElementById('grid');

  const label = document.getElementById('countLabel');

  label.innerHTML = `Exibindo ${lista.length} Pokémons`;

  grid.innerHTML = lista
    .map((p, i) => criarCard(p, i))
    .join('');
}

function criarCard(p) {

  const img =
    p.sprites?.other?.['official-artwork']?.front_default
    || p.sprites?.front_default
    || '';

  const tipos = p.types.map(t => t.type.name);

  const badges = tipos.map(t =>
    `<span class="type-badge type-${t}">
      ${traduzirTipo(t)}
    </span>`
  ).join('');

  const habilidades = p.abilities
    .map(a => a.ability.name)
    .join(', ');

  return `

  <div class="flip-card" onclick="abrirModal(${p.id})">

    <div class="flip-card-inner">

      <div class="flip-card-front">

        <div class="card-id">
          #${String(p.id).padStart(3,'0')}
        </div>

        <img
          class="card-img"
          src="${img}"
          alt="${p.name}"
        >

        <div class="card-name">
          ${traduzirNome(p.name)}
        </div>

        <div class="types">
          ${badges}
        </div>

      </div>

      <div class="flip-card-back">

        <h2>${traduzirNome(p.name)}</h2>

        <div class="back-info">
          <strong>Altura:</strong>
          ${(p.height / 10).toFixed(1)}m
        </div>

        <div class="back-info">
          <strong>Peso:</strong>
          ${(p.weight / 10).toFixed(1)}kg
        </div>

        <div class="back-info">
          <strong>Habilidades:</strong>
          ${habilidades}
        </div>

        <div class="types">
          ${badges}
        </div>

      </div>

    </div>

  </div>

  `;
}

async function buscar() {

  const query = document
    .getElementById('searchInput')
    .value
    .trim()
    .toLowerCase();

  if (!query) {
    resetar();
    return;
  }

  const encontrados = todosPokemons.filter(p =>
    p.name.includes(query)
    || String(p.id) === query
  );

  renderizar(encontrados);
}

function filtrarTipo() {

  const tipo = document
    .getElementById('typeSelect')
    .value;

  if (!tipo) {
    renderizar(todosPokemons);
    return;
  }

  const filtrados = todosPokemons.filter(p =>
    p.types.some(t => t.type.name === tipo)
  );

  renderizar(filtrados);
}

function resetar() {

  document.getElementById('searchInput').value = '';

  document.getElementById('typeSelect').value = '';

  renderizar(todosPokemons);
}

function abrirModal(id) {

  const modal = document.getElementById('modal');

  const content = document.getElementById('modalContent');

  const p = todosPokemons.find(x => x.id === id);

  const img =
    p.sprites?.other?.['official-artwork']?.front_default
    || p.sprites?.front_default
    || '';

  const badges = p.types.map(t =>
    `<span class="type-badge type-${t.type.name}">
      ${traduzirTipo(t.type.name)}
    </span>`
  ).join('');

  content.innerHTML = `

    <button class="modal-close" onclick="fecharModal()">
      ✕
    </button>

    <div style="text-align:center">

      <img class="modal-img" src="${img}">

      <h2>
        ${traduzirNome(p.name)}
      </h2>

      <p>
        #${String(p.id).padStart(3,'0')}
      </p>

      <br>

      <div class="types">
        ${badges}
      </div>

    </div>

  `;

  modal.style.display = 'flex';
}

function fecharModal(e) {

  if (!e || e.target.id === 'modal') {

    document.getElementById('modal').style.display = 'none';
  }
}

function mostrarLoading() {

  document.getElementById('grid').innerHTML = `

    <div style="padding:50px;text-align:center">
      Carregando Pokémons...
    </div>
  `;
}

function traduzirTipo(tipo) {

  const tipos = {
    fire: 'Fogo',
    water: 'Água',
    grass: 'Planta',
    electric: 'Elétrico',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Veneno',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Metal',
    fairy: 'Fada',
    normal: 'Normal'
  };

  return tipos[tipo] || tipo;
}

function traduzirNome(nome) {

  return nome
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

document
  .getElementById('searchInput')
  .addEventListener('keydown', e => {

    if (e.key === 'Enter') {
      buscar();
    }
  });

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    fecharModal();
  }
});

carregarInicial();
let globalNames = [];
let finalNames = [];
let inputField = null;
let searchBtn = null;
let listField = null;
let listInnerHTML = null;
let detailsInnerHTML = null;
let filterState = null;
let detailsField = null;
let detailsState = null;
window.addEventListener('load', async () => {
  await fetchData(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  configureVars();

  removeJunk();
});

async function fetchData(url) {
  const data = await fetch(url);
  const json = await data.json();
  globalNames = json.results;
}

function configureVars() {
  inputField = document.querySelector('#input-field');
  searchBtn = document.querySelector('#button-addon2');
  listField = document.querySelector('.list-group');
  filterState = document.querySelector('#filter-state');

  detailsField = document.querySelector('#details-list');
  detailsState = document.querySelector('#details-state');

  searchBtn.addEventListener('click', () => {
    search(inputField.value);
  });

  inputField.addEventListener('keyup', ({ key, target: { value } }) => {
    value = value.trim();
    if (value === '') {
      searchBtn.setAttribute('disabled', true);
      return;
    }
    searchBtn.removeAttribute('disabled');
    if (key === 'Enter') {
      search(value.toLowerCase());
    }
  });
}

function search(find) {
  let namesList = finalNames.filter(({ name }) => {
    nameLowerCase = name.toLowerCase();
    return nameLowerCase.includes(find);
  });

  render(namesList);
}

function render(users) {
  let masculino = 0;
  let feminino = 0;
  let soma = 0;
  let media = 0;

  filterState.innerHTML = `${users.length} usuário(s) encontrado(s)`;

  listInnerHTML = '';
  detailsInnerHTML = '';

  listField.innerHTML = listInnerHTML;
  detailsField.innerHTML = detailsInnerHTML;

  users.forEach((user) => {
    let { name, picture, gender, age } = user;

    soma += age;

    if (gender === 'female') {
      feminino++;
    } else {
      masculino++;
    }
    listInnerHTML += `<li class="list-group-item">
    <img
      src="${picture}"
      alt="${picture}"
      class="img-thumbnail rounded-circle"
    />
    ${name}, ${age} anos
  </li>`;
  });

  media = Intl.NumberFormat('pt').format(soma / users.length);

  detailsInnerHTML = `<li class="list-group-item">Sexo masculino: ${masculino}</li>
  <li class="list-group-item">Sexo feminino: ${feminino}</li>
  <li class="list-group-item">Soma das idades: ${soma}</li>
  <li class="list-group-item">Média das idades: ${media}</li>`;
  detailsState.innerHTML = 'Estatísticas';
  listField.innerHTML = listInnerHTML;
  detailsField.innerHTML = detailsInnerHTML;
}

function removeJunk() {
  finalNames = globalNames.map(
    ({
      gender,
      name: { first, last },
      dob: { age },
      picture: { thumbnail },
    }) => {
      return {
        gender,
        name: `${first} ${last}`,
        age,
        picture: thumbnail,
      };
    }
  );
}

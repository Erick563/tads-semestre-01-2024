function createTable(headers, data, dataKeys) {

    if (data.length == 0)
        return;

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        dataKeys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

Rest.get('https://brasilapi.com.br/api/taxas/v1')
    .then(data => {
        const headers = ['Taxa', 'Valor %'];
        const dataKeys = ['nome', 'valor'];
        const table = createTable(headers, data, dataKeys);

        const taxasBrasil = document.getElementById('taxasBrasil');
        taxasBrasil.appendChild(table);
    });

Rest.get('https://brasilapi.com.br/api/ibge/municipios/v1/RS?providers=dados-abertos-br,gov,wikipedia')
    .then(data => {
        const headers = ['Municipio', 'Código IBGE'];
        const dataKeys = ['nome', 'codigo_ibge'];
        const table = createTable(headers, data, dataKeys);

        const municipiosRS = document.getElementById('municipiosRS');
        municipiosRS.appendChild(table);
    });


function buscarCep() {
    const cep = document.getElementById('cep').value;
    if (!cep)
        return;

    const url = `https://brasilapi.com.br/api/cep/v1/${cep}`;

    Rest.get(url)
        .then(data => {

            const headers = ['CEP', 'Logradouro', 'Bairro', 'Cidade', 'Estado'];
            const dataKeys = ['cep', 'street', 'neighborhood', 'city', 'state'];
            const table = createTable(headers, [data], dataKeys);

            const endereco = document.getElementById('endereco');
            endereco.innerHTML = '';
            endereco.appendChild(table);
        });
}

document.getElementById('botaoBuscaPorCep').onclick = buscarCep;
document.getElementById('cep').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        buscarCep();
    }
});

function buscarFeriados() {
    const ano = document.getElementById('ano').value;
    if (!ano)
        return;

    const url = `https://brasilapi.com.br/api/feriados/v1/${ano}`;

    Rest.get(url)
        .then(data => {

            if(data.length == 0)
                return;

            data.forEach(item => {
                let date = new Date(item.date);
                let localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                item.date = localDate.toLocaleDateString();
            });

            const headers = ['Data', 'Nome', 'Tipo'];
            const dataKeys = ['date', 'name', 'type'];
            const table = createTable(headers, data, dataKeys);

            const feriados = document.getElementById('feriados');
            feriados.innerHTML = '';
            feriados.appendChild(table);
        });
}

document.getElementById('botaoBuscaFeriadoPorAno').onclick = buscarFeriados;
document.getElementById('ano').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        buscarFeriados();
    }
});

const urls = [
    'https://swapi.dev/api/films/',
    'https://swapi.dev/api/vehicles/',
    'https://swapi.dev/api/people'
];

function fetchData(url) {
    return new Promise((resolve, reject) => {
        Rest.get(url)
            .then(data => {
                resolve(data);
            })
            .catch(error => reject(error));
    });
}

let promissses = urls.map(url => fetchData(url));

Promise.race(promissses)
    .then(result => {
        const results = result.results;
        const attributeNames = Object.keys(results[0]).slice(0, 5);
        const attributeArray = [...attributeNames];
        const table = createTable(attributeArray, results, attributeArray);

        const race = document.getElementById('race');
        race.appendChild(table);

    });

Promise.all(promissses)
    .then((result) => {
        result.forEach((data) => {
            const results = data.results;
            const attributeNames = Object.keys(results[0]).slice(0, 5);
            const attributeArray = [...attributeNames];
            const table = createTable(attributeArray, results, attributeArray);

            const all = document.getElementById('all');
            all.appendChild(table);
        })
    });
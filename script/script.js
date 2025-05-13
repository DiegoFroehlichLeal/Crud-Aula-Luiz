const contentDiv = document.getElementById("content");
const ol = document.createElement("ol");
contentDiv.appendChild(ol);

// Contador para o próximo número de item a ser usado ao adicionar novos itens.
// Ele será atualizado após carregar os dados iniciais.
let proximoNumeroItem = 1;

// Função para criar um item da lista com seu número persistente
function createListItem(text, itemNumber) {
    const li = document.createElement("li");
    li.textContent = `[${itemNumber}] ${text}`;
    li.dataset.itemNumber = itemNumber;
    return li;
}

async function carregarDados() {
    try {
        const response = await fetch('https://catolicasc.github.io/api-teste/request.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dadosConvertido = await response.json();
        let maiorNumeroExistente = 0;
        dadosConvertido.forEach((post, index) => {
            // Para os dados iniciais, usamos o índice + 1 como o número do item.
            const numeroDoItemAtual = index + 1;
            const li = createListItem(post.title, numeroDoItemAtual);
            ol.appendChild(li);
            if (numeroDoItemAtual > maiorNumeroExistente) {
                maiorNumeroExistente = numeroDoItemAtual;
            }
        });
        // Define o próximo número de item como o maior número carregado + 1
        proximoNumeroItem = maiorNumeroExistente + 1;
    } catch (error) {
        console.error("Falha ao carregar dados:", error);
        alert("Não foi possível carregar os posts iniciais.");
    }
}

carregarDados();

document.getElementById("botAdicionar").addEventListener("click", () => {
    const novo_item_input = document.getElementById("adicionarItem");
    const texto_item = novo_item_input.value.trim();
    if (texto_item) {
        const li = createListItem(texto_item, proximoNumeroItem);
        ol.appendChild(li);
        proximoNumeroItem++;
        novo_item_input.value = "";
    } else {
        alert("Digite um texto para adicionar.");
    }
});

// Função auxiliar para encontrar um item pelo seu número
function encontrarItemPorNumero(numero) {
    for (let i = 0; i < ol.children.length; i++) {
        const li = ol.children[i];
        if (li.dataset.itemNumber === numero.toString()) {
            return li;
        }
    }
    return null; // Se não encontrar retorna nulo
}

document.getElementById("botEditar").addEventListener("click", () => {
    const codigoItemInput = document.getElementById("id_item");
    const descricaoItemInput = document.getElementById("descItem");

    const numeroItemParaEditar = codigoItemInput.value;
    const novaDescricao = descricaoItemInput.value.trim();

    if (!numeroItemParaEditar) {
        alert("Por favor, insira o número do item para editar.");
        return;
    }

    const itemParaEditar = encontrarItemPorNumero(numeroItemParaEditar);

    if (itemParaEditar) {
        if (novaDescricao !== "") {
            itemParaEditar.textContent = `[${numeroItemParaEditar}] ${novaDescricao}`;
        } else {
            alert("Digite uma nova descrição para o item.");
        }
    } else {
        alert(`Item com número [${numeroItemParaEditar}] não encontrado.`);
    }

    codigoItemInput.value = "";
    descricaoItemInput.value = "";
});

document.getElementById("botRemover").addEventListener("click", () => {
    const codigoItemInput = document.getElementById("id_item");
    const numeroItemParaRemover = codigoItemInput.value;

    if (!numeroItemParaRemover) {
        alert("Por favor, insira o número do item para remover.");
        return;
    }

    const itemParaRemover = encontrarItemPorNumero(numeroItemParaRemover);

    if (itemParaRemover) {
        ol.removeChild(itemParaRemover);
    } else {
        alert(`Item com número [${numeroItemParaRemover}] não encontrado.`);
    }
    codigoItemInput.value = "";
    document.getElementById("descItem").value = "";
});
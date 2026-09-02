const campoPesquisa = document.getElementById("termo");
const botaoPesquisar = document.getElementById("btnPesquisar");

botaoPesquisar.addEventListener("click", pesquisarWikipedia);

campoPesquisa.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        pesquisarWikipedia();
    }
});

async function pesquisarWikipedia() {

    const termo = campoPesquisa.value.trim();

    const mensagem = document.getElementById("mensagem");
    const resultado = document.getElementById("resultado");

    if (termo === "") {
        mensagem.innerText = "Digite um termo para pesquisar.";
        resultado.style.display = "none";
        return;
    }

    mensagem.innerText = "Pesquisando na Wikipédia...";
    resultado.style.display = "none";

    try {

        // URL da API externa da Wikipédia
        const url =
            "https://pt.wikipedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(termo) +
            "&gsrlimit=1" +
            "&prop=extracts|pageimages" +
            "&exintro=1" +
            "&explaintext=1" +
            "&piprop=thumbnail" +
            "&pithumbsize=600" +
            "&format=json" +
            "&origin=*";

        // Faz a requisição GET para a API
        const resposta = await fetch(url);

        // Converte a resposta para JSON
        const dados = await resposta.json();

        if (!dados.query || !dados.query.pages) {
            mensagem.innerText = "Nenhum resultado encontrado.";
            return;
        }

        // A API devolve um objeto de páginas.
        // Pegamos a primeira página encontrada.
        const paginas = Object.values(dados.query.pages);
        const artigo = paginas[0];

        document.getElementById("titulo").innerText =
            artigo.title;

        document.getElementById("resumo").innerText =
            artigo.extract
                ? artigo.extract.substring(0, 500) +
                  (artigo.extract.length > 500 ? "..." : "")
                : "A Wikipédia não retornou um resumo para este artigo.";

        const imagem = document.getElementById("imagem");

        if (artigo.thumbnail && artigo.thumbnail.source) {
            imagem.src = artigo.thumbnail.source;
            imagem.style.display = "block";
        } else {
            imagem.removeAttribute("src");
            imagem.style.display = "none";
        }

        document.getElementById("linkArtigo").href =
            "https://pt.wikipedia.org/?curid=" + artigo.pageid;

        mensagem.innerText = "";
        resultado.style.display = "block";

    } catch (erro) {

        mensagem.innerText = "Erro ao acessar a API da Wikipédia.";
        resultado.style.display = "none";

        console.error(erro);
    }
}

export class GithubUser {
    static search(username) {   // cria um método do tipo estático para busca do username no Github
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)  // retorna o fetch que busca os dados em forma de string na endpoint
        .then(data => data.json())  // transforma o dado que o fetch buscou em json
        .then(({login, name, public_repos, followers}) => ({    //pega o dado json e transforma em um objeto. Forma desestruturada de escrever
            login,
            name,
            public_repos,
            followers,
        }))
    }
}

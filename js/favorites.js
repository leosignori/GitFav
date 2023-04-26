import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        // Local Storage - API do browser que guarda informações, como se fosse um mini banco de dados.
        // .parse() é uma propriedade do JSON que modifica um dado JSON (string) em um array ou objeto de fato
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username) // find é uma higher order function que retorna true ou false

            if(userExists) {
                throw new Error ('Usuário já cadastrado.')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado.')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries // pega o novo array filteredEntries e reatribui ao array entries, preservando o princípio de imutabilidade
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites { // conceito de herança
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.add-button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        this.emptyState()
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove-button').onclick = () => {
                const isOk = confirm(`Deseja deletar ${user.name} da lista?`)

                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row) // append é uma funcionalidade da DOM que insere um conteúdo (recebido como parâmetro) no formato HTML
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <tr>
                <td class="user">
                    <img src="https://github.com/leosignori.png" alt="Imagem de leosignori">
                    <a href="https://github.com/leosignori" target="_blank">
                        <p>Leonardo Signori</p>
                        /<span>leosignori</span>
                    </a>
                </td>
                <td class="repositories">
                    2
                </td>
                <td class="followers">
                    5
                </td>
                <td class="remove">
                    <button class="remove-button">Remover</button>
                </td>
            </tr>
        `

        return tr 
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => { // forEach é uma funcionalidade de array, e o tr neste caso é um "array like"
            tr.remove()
        })
    }

    emptyState() {
        if (this.entries.length === 0) {
            this.root.querySelector('.empty-state').classList.remove('hide')
        } else {
            this.root.querySelector('.empty-state').classList.add('hide')
        }
    }    
}
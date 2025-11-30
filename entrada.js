// Pegar os valores q o usuario, e tranformar em padrão
class Entrada {

    // construtor da classe
    constructor(expressao) {
        this.pedacos = expressao.replace(/\s+/g, '').match(/(\d+\.?\d*|i|conj|sqrt|[a-zA-Z_]\w*|[+\-*/^()])/g) || [];
        this.indexAtualPedaco = 0;
    }

    // ----- Metodos -----

    // pegar as partes da expressao
    pegar() {
        return this.pedacos[this.indexAtualPedaco];
    }

    // avancar na expressao
    avancar() {
        this.indexAtualPedaco++;
    }

    // entrada da expressao
    entrada() {
        if (this.pedacos.length === 0) {
            throw new Error('Expressão vazia.')
        }
        const resultado = this.expressaoEntrada();

        if (this.indexAtualPedaco < this.pedacos.length) {
            throw new Error(`Erro na sintaxe, parte inesperada: ${this.pegar()}`)
        }
        return resultado;
    }

    // entrada da expressão com os sinais de + e -
    expressaoEntrada() {
        let no = this.entradaTermo();
        while (this.pegar() === '+' || this.pegar() === '-') {
            const operador = this.pegar();
            this.avancar();
            const direita = this.entradaTermo();
            no = { tipo: 'binario', operador, esquerda: no, direita: direita };
        }
        return no;
    }

    // entrada da expressão com os sinais de * e /
    entradaTermo() {
        let no = this.fatorEntrada();
        while (this.pegar() === '*' || this.pegar() === '/') {
            const operador = this.pegar();
            this.avancar();
            const direita = this.fatorEntrada();
            no = { tipo: 'binario', operador, esquerda: no, direita: direita };
        }
        return no;
    }

    // entrada da expressão com os sinais de ^
    fatorEntrada() {
        let no = this.entradaPrimeira();
        while (this.pegar() === '^') {
            const operador = this.pegar();
            this.avancar();
            const direita = this.entradaPrimeira();
            no = { tipo: 'binario', operador, esquerda: no, direita: direita };
        }
        return no;
    }

    // entrada da expressão caso seja uma raiz (sqrt) ou uma conjugado (conj), ou seja um numero imaginário com i
    entradaPrimeira() {
        const pedaco = this.pegar();

        if (!isNaN(parseFloat(pedaco))) {
            this.avancar();
            return { tipo: 'numero', valor: parseFloat(pedaco) };
        }

        if (pedaco === 'i') {
            this.avancar();
            return { tipo: 'imaginario' };
        }

        if (pedaco === 'conj' || pedaco === 'sqrt') { //Lembra de por 2*i, para funfar
            this.avancar();
            if (this.pegar() !== '(') throw new Error(`Esperado '(' após a função ${pedaco}...`)
            this.avancar();
            const dento = this.expressaoEntrada();
            if (this.pegar() !== ')') throw new Error(`Esperado ')' para fechar a função ${pedaco}...`)
            this.avancar();
            return { tipo: 'funcao', func: pedaco, dento: dento };
        }

        if (pedaco.match(/[a-zA-Z_]\w*/)) {
            this.avancar();
            return { tipo: 'variavel', nome: pedaco };
        }

        if (pedaco === '(') {
            this.avancar();
            const no = this.expressaoEntrada();
            if (this.pegar() !== ')') {
                throw new Error("Esperado ')' para fechar o parêntese...");
            }
            this.avancar();
            return no;
        }

        if (pedaco === '-') {
            this.avancar();
            const operado = this.fatorEntrada();
            return { tipo: 'unario', operador: '-', operado: operado };
        }
        throw new Error(`Parte inválida ou inesperada: ${pedaco}`);
    }
}

export { Entrada };
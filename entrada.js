// Pegar os valores q o usuario, e tranformar em padrão
class Entrada {
    constructor(expressao){
        this.pedacos = expressao.replace(/\s+/g, '').match(/(\d+\.?\d*|i|[a-zA-Z_]\w*|[+\-*/^()]|conj|sqrt)/g) || [];
        this.indexAtualPedaco = 0;
    }

    pegar(){
        return this.pedacos[this.indexAtualPedaco];
    }

    avancar(){
        this.indexAtualPedaco++;
    }

    entrada() {
        const resultado = this.expressaoEntrada();

        if(this.indexAtualPedaco < this.pedacos.length) {
            throw new Error(`Erro na sintaxe, parte inesperada: ${this.pegar()}`)
        }
        return resultado;
    }

    expressaoEntrada(){ // 2i +3 || 2i- 1
        let no = this.entradaTermo();
        while(this.pegar() === '+' || this.pegar() === '-'){
            const operador = this.pegar();
            this.avancar();
            const esquerda = this.entradaTermo();
            no = {tipo: 'binario', operador, esquerda: no, direira};
        }
        return no;
    }

    entradaTermo(){
        let no = this.fatorEntrada();
        while(this.pegar() === '*' || this.pegar() === '/'){
            const operador = this.pegar();
            this.avancar();
            const esquerda = this.entradaTermo();
            no = {tipo: 'binario', operador, esquerda: no, direira};
        }
        return no;
    }

    fatorEntrada(){
        let no = this.entradaPrimaria();
        while(this.pegar() === '^'){
            const operador = this.pegar();
            this.avancar();
            const esquerda = this.entradaTermo();
            no = {tipo: 'binario', operador, esquerda: no, direira};
        }
        return no;
    }

    entradaPrimeira(){
        const pedaco = this.pegar();

        if(pedaco === 'i') {
            this.avancar();
            return {tipo: 'imaginario'};
        }
        if(pedaco === 'conj' || pedaco === 'sqrt' ){
            this.avancar();
            if(this.pegar() !== '(') { throw new Error(`Esperado '(' após a função ${pedaco}...`)}
            this.avancar();
            const dento = this.expressaoEntrada();
            if(this.pegar() !== ')') { throw new Error(`Esperado '(' para fechar a função ${pedaco}...`)}
            this.avancar();
            return {tipo: 'funcao', func: pedaco, dento: dento};
        }

        if(pedaco.match(/[a-zA-Z_]\w*, ''/)) {
            this.avancar();
            return {tipo: 'variavel', nome: pedaco};
        }

        if(pedaco === '('){
            this.avancar();
            const no = this.expressaoEntrada();
            if(this.pegar() !== ')') {
                throw new Error("Esperado ')' para fechar o parêntese...");
            }
            this.avancar();
            return no;
        }

        if(pedaco === '-'){
            this.avancar();
            const operado = this.fatorEntrada();
            return {tipo: 'unario', operador: '-', operado: operado};
        }
        throw new Error(`Parte inválida ou inesperada: ${pedaco}`);
    }
}

export {Entrada};
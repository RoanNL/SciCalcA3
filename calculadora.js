// Classe responsavel por realizar a logica da calculadora envinando os dados para a classe Complexo
import { Complexo } from './complexo.js';

// Variaveis globais da calculadora
let valorVariavel = new Map();

// Funcao que realiza a logica da calculadora
function calculadora(no) {
    // Verifica o tipo do no e realiza a operacao
    switch (no.tipo) {

        // Caso seja um numero
        case 'numero':
            return new Complexo(no.valor, 0);

        // Caso seja um numero imaginario
        case 'imaginario':
            return new Complexo(0, 1)

        // Caso seja uma variavel
        case 'variavel':
            if (!valorVariavel.has(no.nome)) {
                throw new Error(`Variável "${no.nome}" não definida!`)
            }
            return valorVariavel.get(no.nome);

        // Caso seja uma operação binaria, + - * / ^
        case 'binario':
            const esquerda = calculadora(no.esquerda);
            const direita = calculadora(no.direita);
            switch (no.operador) {
                case '+': return esquerda.adicao(direita);
                case '-': return esquerda.subtracao(direita);
                case '*': return esquerda.multiplicacao(direita);
                case '/': return esquerda.divisao(direita);
                case '^': return esquerda.potencia(direita.real);
                default:
                    throw new Error(`Operador desconhecido: ${no.operador}`);
            }

        // Caso seja uma funcao, sqrt ou conj
        case 'funcao':
            const dento = calculadora(no.dento);
            switch (no.func) {
                case 'sqrt': return dento.raiz(2);
                case 'conj': return dento.conjulgado();
                default:
                    throw new Error('Função desconhecida: ${no.func}');
            }

        // Caso seja uma operação unaria, negativa (-a + -b*i)
        case 'unario':
            const operado = calculadora(no.operado);
            switch (no.operador) {
                case '-': return new Complexo(-operado.real, -operado.imag);
                default:
                    throw new Error('Operador unário desconhecido: ${no.operador}');
            }

        default:
            throw new Error(`Tipo de nó desconhecido na árvore: ${no.tipo}`);
    }
}

// Funcao responsavel por encontrar as variaveis de uma expressao
function encontrarVariavel(no) {
    const variaveis = new Set();
    function atravessar(noAtual) {
        if (!noAtual) return;
        if (noAtual.tipo === 'variavel') {
            variaveis.add(noAtual.nome);
        }
        if (noAtual.esquerda) atravessar(noAtual.esquerda);
        if (noAtual.direita) atravessar(noAtual.direita);
        if (noAtual.operado) atravessar(noAtual.operado);
        if (noAtual.dento) atravessar(noAtual.dento);
    }
    atravessar(no);
    return variaveis;
}

// Funcao responsavel por limpar a tela
function limparTela() {
    console.clear();
}

export { calculadora, valorVariavel, encontrarVariavel, limparTela }
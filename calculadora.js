import {Complexo} from './complexo.js';

let valorVariavel = new Map();

function calculadora(no){
    switch(no.tipo) {
        case 'numero':
            return new Complexo(no.valor, 0);
        
        case 'imaginario':
            return new Complexo(0, 1)    
        
        case 'variavel':
            if(!valorVariavel.has(no.nome)){
                throw new Error(`Variável "${no.nome}" não definida!!!!`)
            }
            return valorVariavel.get(no.nome);

        case 'binario':
            const esquerda = calculadora(no.esquerda);
            const direita = calculadora(no.direita);
            switch(no.operador){
                case '+': return esquerda.adicao(direita);
                case '-': return esquerda.subtracao(direita);
                case '*': return esquerda.multiplicacao(direita);
                case '/': return esquerda.dividir(direita);
                case '^': return esquerda.potencia(direita.real);
                default:
                    throw new Error(`Operador desconhecido: ${no.operador}`);   
            }
        
        case 'funcao':
        const dento = calculadora(no.dento);
        switch(no.nome){
            case 'sqrt': return dento.raiz(2)
            case 'conj': return dento.conjugado()
            default:
                throw new Error('Função desconhecida: ${no.nome}');
        }
        
        case 'unario':
            const operado = calculadora(no.operado);
        switch(no.operador){
            case '-': return new Complexo(-operado.real, -operado.imag);
            default:
                throw new Error('Operador unário desconhecido: ${no.operador}');
        }
     
        default:
            throw new Error(`Tipo de nó desconhecido na árvore: ${no.tipo}`);
    }
}

function encontrarVariavel(no){
    const variaveis = new Set();
    function atravessar(noAtual){
        if (!noAtual) return;
        if (noAtual.tipo === 'variavel'){
            variaveis.add(noAtual.nome);
        }
        if (noAtual.esquerda) atravessar(noAtual.esquerda);
        if (noAtual.direita) atravessar(noAtual.direita);
        if (noAtual.operador) atravessar(noAtual.operador);
        if (noAtual.dento) atravessar(noAtual.dento);
    }
    atravessar(no);
    return variaveis;
}

export {calculadora, valorVariavel, encontrarVariavel}
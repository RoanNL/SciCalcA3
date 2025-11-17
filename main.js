import { createInterface } from 'readline/promises';
import { Entrada } from './entrada.js'
import { calculadora, encontrarVariavel, valorVariavel } from './calculadora.js'
import { Complexo } from './complexo.js'

const leitor = createInterface({
    input: process.stdin,
    output: process.stdout
})

function arvoreParaLisp(no) {
    if (!no) return '';

    switch (no.tipo) {
        case 'numero':
            return `${no.valor}`;
        case 'imaginario':
            return 'i';
        case 'variavel':
            return no.nome;
        case 'funcao':
            return `${no.func} ${arvoreParaLisp(no.dento)}`;
        case 'unario':
            return `${no.operador} ${arvoreParaLisp(no.operado)}`;
        case 'binario':
            return `${no.operador} ${arvoreParaLisp(no.esquerda)} ${arvoreParaLisp(no.direita)}`;
        default:
            return ''
    }
}


console.log('--- Calculadora de Complexos ---')
console.log('Para sair digite "sair" e "Comparar" para comparar dois complexos \nCaso queira fazer o calculo direto é só por a expressão... seu maldito')

while (true) {
    const expressao = await leitor.question('Digite malandro huehuehue: ');
    if (expressao.toLowerCase() === 'sair') {
        break;
    }

    if (expressao.trim() === '') {
        continue;
    }

    if(expressao.toLowerCase() === 'comparar'){
        try{
            console.log('--- Comparando dois Complexos ---');

            const expressao1 = await leitor.question('Digite o primeiro complexo: ');
            const entrada1 = new Entrada(expressao1);
            const arvore1lisp = arvoreParaLisp(entrada1.entrada());
            
            const expressao2 = await leitor.question('Digite o segundo complexo: ');
            const entrada2 = new Entrada(expressao2);
            const arvore2lisp = arvoreParaLisp(entrada2.entrada());

            if (arvore1lisp === arvore2lisp){
                console.log('Os complexos são iguais');
            }else{
                console.log('Os complexos são diferentes');
            }
        
        }catch(error){
            console.error(`Erro na comparção: ${error.message}\n`);
        } 
        continue;
    }

    try {
        const entrada = new Entrada(expressao);
        const arvore = entrada.entrada();

        console.log('--- Árvore em LISP ---');
        console.log(arvoreParaLisp(arvore));
        console.log('--------------------------')
        console.log(' ');

        const variaveis = encontrarVariavel(arvore);
        valorVariavel.clear();

        for (const v of variaveis){
            const pedido = await leitor.question(`Digite o valor da variável ${v}: (formato 'a b' para a + b*i') `);
            const partes = pedido.trim().split(/\s+/);
            const real = parseFloat(partes[0]) || 0;
            const imag = parseFloat(partes[1]) || 0;
            valorVariavel.set(v, new Complexo(real, imag))
        }

        const resultado = calculadora(arvore);
        console.log(`--- Resultado --- \n ${resultado.toString()} `)
        console.log(' ');

    } catch (error) {
        console.error(`Erro: ${error.message}\n`);
    }
}

leitor.close();
console.log('');
console.log('Calculadora esta dizendo tchau')

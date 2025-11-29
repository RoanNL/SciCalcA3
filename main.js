import { createInterface } from 'readline/promises';
import { Entrada } from './entrada.js'
import { calculadora, encontrarVariavel, limparTela, valorVariavel } from './calculadora.js'
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
            return `(${no.func} ${arvoreParaLisp(no.dento)})`;
        case 'unario':
            return `(${no.operador} ${arvoreParaLisp(no.operado)})`;
        case 'binario':
            return `(${no.operador} ${arvoreParaLisp(no.esquerda)} ${arvoreParaLisp(no.direita)})`;
        default:
            return ''
    }
}

function calculoVariavel(valor) {
    if (!valor) {
        return 0;
    }
    try {
        const entrada = new Entrada(valor);
        const arvore = entrada.entrada();
        const resultado = calculadora(arvore)
        return resultado.real;
    } catch (e) {
        return NaN;
    }
}


let desfazedordemerda = true;
do {
    console.log(' ');
    console.log('--- Calculadora de Complexos ---')
    console.log('Digite 1 para utilizar a calculadora\nDigite 2 para entender sobre a aplicação\nDigite "sair" para sair da aplicação')
    const entrada = await leitor.question('> ')
    switch (entrada) {
        case '1':
            while (true) {
                console.log ('\nDigite o calculo da expressão completa\nDigite "voltar" para retornar ao menu')
                const expressao = await leitor.question('> ');
                if (expressao.toLowerCase() === 'voltar') {
                    break;
                }

                if (expressao.trim() === '') {
                    continue;
                }

                if (expressao.toLowerCase() === 'comparar') {
                    try {
                        console.log('\n--- Comparando dois Complexos ---');

                        const expressao1 = await leitor.question('Digite o primeiro complexo: ');
                        const entrada1 = new Entrada(expressao1);
                        const arvore1lisp = arvoreParaLisp(entrada1.entrada());

                        const expressao2 = await leitor.question('Digite o segundo complexo: ');
                        const entrada2 = new Entrada(expressao2);
                        const arvore2lisp = arvoreParaLisp(entrada2.entrada());

                        if (arvore1lisp === arvore2lisp) {
                            console.log('Os complexos são iguais');
                        } else {
                            console.log('Os complexos são diferentes');
                        }

                    } catch (error) {
                        console.error(`Erro na comparção: ${error.message}\n`);
                    }
                    continue;
                }

                try {
                    const entrada = new Entrada(expressao);
                    const arvore = entrada.entrada();

                    console.log('\n--- Árvore em LISP ---');
                    console.log(arvoreParaLisp(arvore));
                    console.log('--------------------------')
                    console.log(' ');

                    const variaveis = encontrarVariavel(arvore);
                    valorVariavel.clear();

                    if (variaveis.size > 0) {
                        console.log('Variáveis foram encontradas... Digite o valor delas')

                        for (const v of variaveis) {
                            let entradaValida = false;

                            while (!entradaValida) {
                                const pedido = await leitor.question(`Digite o valor da variável '${v}' (use espaço para separar valor real de imaginário, ex:(2 3, para 2 + 3*i))`);
                                const partes = pedido.replace(/['"]/g, '').replace(',', '.').trim().split(/\s+/);
                                const real = calculoVariavel(partes[0]);
                                const imag = partes[1] ? calculoVariavel(partes[1]) : 0;

                                if (isNaN(real) || isNaN(imag)) {
                                    console.log(`Entrada inválida para a variável '${v} '. Digite numeros doido.`)
                                } else {
                                    valorVariavel.set(v, new Complexo(real, imag))
                                    entradaValida = true;
                                }
                            }
                        }
                    }

                    const resultado = calculadora(arvore);
                    console.log(`\n--- Resultado --- \n ${resultado.toString()} `)
                    console.log(' ');

                } catch (error) {
                    console.error(`Erro: ${error.message}\n`);
                }
            }
            limparTela();
            break;
        case '2':
            console.log(' ');
            console.log('Na calculadora você pode digitar "Comparar" para comparar dois complexos atráves da árvore LISP gerada')
            console.log('Para sair digite "sair" e \nCaso queira fazer o calculo direto é só por a expressão (para real(a) +/- parte imaginária(b)*i)')
            console.log(' ');
            break;
        case 'sair':
            leitor.close();
            console.log('');
            console.log('Calculadora esta dizendo tchau')
            desfazedordemerda = false;
            break;
        default:
            console.log('Opção inválida. Por favor, escolha 1, 2 ou sair. ');
            break;
    }
}  while (desfazedordemerda); 
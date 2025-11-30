// classe reponsavel por gerar o menu
// importando as classes e bibliotecas
import { createInterface } from 'readline/promises';
import { Entrada } from './entrada.js'
import { calculadora, encontrarVariavel, limparTela, valorVariavel } from './calculadora.js'
import { Complexo } from './complexo.js'

// variável de entrada do usuario
const leitor = createInterface({
    input: process.stdin,
    output: process.stdout
})

// funcao que transforma a arvore em lisp
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

// funcao que realiza o calculo da variavel adicionada pelo usuario e retorna o resultado
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

// funcao que gera o menu
export async function menu() {

    // inicio do menu com o do while
    let loopDoWhile = true;
    do {
        console.log(' ');
        console.log('--- Calculadora de Complexos ---')
        console.log('Digite 1 para utilizar a calculadora\nDigite 2 para entender sobre a aplicação\nDigite "sair" para sair da aplicação')
        const entrada = await leitor.question('> ')

        // switch case para as opcoes
        switch (entrada) {

            // opcao 1, realizando o calculo da expressao complexa
            case '1':
                while (true) {
                    console.log('\nDigite o calculo da expressão completa\nDigite "voltar" para retornar ao menu\nDigite "Comparar" para comparar dois complexos')
                    const expressao = await leitor.question('> ');
                    if (expressao.toLowerCase() === 'voltar') {
                        break;
                    }

                    if (expressao.trim() === '') {
                        continue;
                    }

                    // opcao para comparar duas expressões
                    if (expressao.toLowerCase() === 'comparar') {
                        try {
                            console.log('\n--- Comparando duas Expressões ---');

                            const expressao1 = await leitor.question('Digite a primeira expressão: ');
                            const entrada1 = new Entrada(expressao1);
                            const arvore1lisp = arvoreParaLisp(entrada1.entrada());

                            const expressao2 = await leitor.question('Digite a segunda expressão: ');
                            const entrada2 = new Entrada(expressao2);
                            const arvore2lisp = arvoreParaLisp(entrada2.entrada());

                            if (arvore1lisp === arvore2lisp) {
                                console.log('As expressões são iguais');
                            } else {
                                console.log('As expressões são diferentes');
                            }

                        } catch (error) {
                            console.error(`Erro na comparção: ${error.message}\n`);
                        }
                        continue;
                    }

                    try {
                        // realizando o calculo da expressao e imprimindo o resultado no console, alem da impressao da arvore em LISP
                        const entrada = new Entrada(expressao);
                        const arvore = entrada.entrada();

                        console.log('\n--- Árvore em LISP ---');
                        console.log(arvoreParaLisp(arvore));
                        console.log('--------------------------')
                        console.log(' ');


                        // caso tenha variaveis na expressao, perguntar ao usuario o valor das variaveis e altera o valor para a realização do calculo
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
                                        console.log(`Entrada inválida para a variável '${v} '. Digite apenas números.`)
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

            // opcao 2, informacoes sobre a aplicacao
            case '2':
                console.log(' ');
                console.log('Na calculadora você pode digitar "Comparar" para comparar dois complexos atráves da árvore LISP gerada.')
                console.log('Para fazer calculos com raiz é necessário por: srqt("expressão")')
                console.log('Para fazer calculos com conjugados é necessário por: conj("expressão")')
                console.log('Para sair digite "sair".')
                console.log('Caso queira fazer o calculo direto é só por a expressão (para real(a) +/- parte imaginária(b)*i)')
                console.log('Criadores da aplicação:\n- Marcílo Batista\n- Marcus Vinicius\n- Roan Lisboa')
                console.log(' ');
                break;
            // opcao sair, encerra o programa
            case 'sair':
                leitor.close();
                console.log('');
                console.log('Calculadora esta dizendo tchau')
                loopDoWhile = false;
                break;
            // opcao invalida, pede para o usuario escolher outra opcao disponível
            default:
                console.log('Opção inválida. Por favor, escolha 1, 2 ou sair. ');
                break;
        }
    } while (loopDoWhile);
}
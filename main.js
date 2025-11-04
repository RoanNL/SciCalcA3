import {createInterface} from 'readline/promises';
import {Entrada} from './entrada.js'

const leitor = createInterface({
    input: process.stdin,
    output: process.stdout
})

while(true){
const expressao = await leitor.question('Digite as expressões a serem calculadas: ');
if(expressao.toLowerCase() === 'sair'){
    break;
}

if(expressao.trim() === ''){
    continue;
}

try{
const entrada = new Entrada(expressao);
const arvoreSintatica = entrada.entrada();

console.log('--- Árvore Sintática ---');
    console.dir(arvoreSintatica, {depth: null});
console.log('--------------------------')
} catch (error){
    console.error(`Erro: ${error.message}\n`);
}
}

leitor.close();
console.log('');
console.log('Calculadora esta dizendo tchau')

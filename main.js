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

const entrada = new Entrada(expressao);

console.log(entrada);

}


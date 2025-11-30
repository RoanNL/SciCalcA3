//Classe responsavel por realizar as operações matemáticas de complexos
class Complexo {
    //Construtor da classe
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    // ----- Metodos Principais -----

    // Operação de adição
    adicao(dados) {
        return new Complexo(this.real + dados.real, this.imag + dados.imag);
    }

    // Operação de subtração
    subtracao(dados) {
        return new Complexo(this.real - dados.real, this.imag - dados.imag);
    }

    // Operação de multiplicação
    multiplicacao(dados) {
        const real = this.real * dados.real - this.imag * dados.imag;
        const imag = this.real * dados.imag + this.imag * dados.real;
        return new Complexo(real, imag);
    }

    // Operação de divisão
    divisao(dados) {

        const denominador = dados.real * dados.real + dados.imag * dados.imag;
        if (denominador === 0) {
            throw new Error('Não existe divisão por 0.')
        }

        const real = (this.real * dados.real + this.imag * dados.imag) / denominador;
        const imag = (this.imag * dados.real - this.real * dados.imag) / denominador;
        return new Complexo(real, imag);
    }

    // Operação de conjugação
    conjulgado() {
        return new Complexo(this.real, -this.imag);
    }

    // Operação de potência
    potencia(expoente) { //Moivre: (r(cosθ + isinθ))^n = r^n(cos(nθ) + isin(nθ))

        const r = Math.sqrt(this.real * this.real + this.imag * this.imag);
        const teta = Math.atan2(this.imag, this.real);

        const rPotn = Math.pow(r, expoente);
        const teta2 = expoente * teta;

        const real = rPotn * Math.cos(teta2);
        const imag = rPotn * Math.sin(teta2);

        return new Complexo(real, imag);
    }

    // Operação de raiz
    raiz(n) {
        if (n == 0) {
            throw new Error('Não existe raiz de 0');
        }
        return this.potencia(1 / n);
    }

    // ----- Metodos auxiliares -----

    // Retornar o complexo em formato de string
    toString() {
        const real = parseFloat(this.real.toFixed(2));
        const imag = parseFloat(this.imag.toFixed(2));

        if (imag === 0) {
            return `${real}`;
        }

        if (real === 0) {
            return `${imag}i`;
        }

        const sinal = imag > 0 ? '+' : '-';
        return `${real} ${sinal} ${Math.abs(imag)}i`;
    }

}

export { Complexo };
class Complexo {
    constructor(real = 0 , imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    adicao(dados){
        return new Complexo(this.real + dados.real, this.imag + dados.imag);
    }
    
    subtracao(dados){
        return new Complexo(this.real - dados.real, this.imag - dados.imag);
    }

    multiplicacao(dados){
        const real = this.real * dados.real - this.imag * dados.imag;
        const imag = this.real * dados.imag + this.imag * dados.real;
        return new Complexo(real, imag);
    }

    divisao(dados){ // (5 + i) / (2 - 3i) => Numerador: (5 + i) * (2 +3i) / Denominador: (2 -3i) * (2 +3i) > 4 -9i^2 > 4 + 9 =13
        if (denominador === 0){
            throw new Error('Não existe divisão por 0.')
        }
        const denominador = dados.real * dados.real + dados.imag * dados.imag;
        const real = (this.real * dados.real + this.imag * dados.imag) / denominador;
        const imag = (this.imag * dados.real - this.real * dados.imag) / denominador;
    }

    conjulgado(){
        return new Complexo(this.real, -this.imag);
    }

    potencia(expoente){ //Moivre: (r(cosθ + isinθ))^n = r^n(cos(nθ) + isin(nθ))
        
        const r = Math.sqrt(this.real * this.real + this.imag * this.imag);
        const teta = Math.atan2(this.imag, this.real);

        const rPotn = Math.pow(r, expoente);
        const teta2 = expoente * teta;

        const real = rPotn * Math.cos(teta2);
        const imag = rPotn * Math.sin(teta2);

        return new Complexo(real, imag);
    }

    raiz(n){
        if(n == 0){
            throw new Error('Não existe raiz de 0');
        }
        return this.potencia(1/n);
    }
}

export {Complexo};
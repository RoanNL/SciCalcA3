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

    divisao(dados){ 
        
        const denominador = dados.real * dados.real + dados.imag * dados.imag;
        if (denominador === 0){
            throw new Error('Não existe divisão por 0.')
        }
        console.log('aqui')
  
        const real = (this.real * dados.real + this.imag * dados.imag) / denominador;
        const imag = (this.imag * dados.real - this.real * dados.imag) / denominador;
        return new Complexo(real, imag);
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


    toString(){
        const real = parseFloat(this.real.toFixed(2));
        const imag = parseFloat(this.imag.toFixed(2));

        if(imag === 0){
            return `${real}`;
        }

        if(real === 0){
            return `${imag}i`;
        }
        
        const sinal = imag > 0 ? '+' : '-';
        return `${real} ${sinal} ${Math.abs(imag)}i`;        
    }
    
}

export {Complexo};
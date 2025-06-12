// Teoricamente isso só é possível ser feito no fromtend pois temos provas predefinidas, talvez seria melhor fazer isso com uma requisição pro backend
export function calcularNota(leitura: string, id_prova: number): number {
    const peso = 0.5;

    let correto;
    switch (id_prova){
        case 1: correto = 'eaedddccaedacbbcbacb'; break;
        case 2: correto = 'bdbbacbbaeececddbdcd'; break;
        case 3: correto = 'abecadcbbcedccabccda'; break;
        case 4: correto = 'baadcaeeacabcdbccade'; break;
        case 5: correto = 'ddddbddcdcacbbecaaed'; break;
        case 6: correto = 'caeabbdecbcecaddaecd'; break;
        default: return -1;
    }

    correto = Array.from(correto);

    let nota = 10;
    Array.from(leitura).forEach((char, index) =>{
        if(char != correto[index]) nota -= peso;
    })

    return nota;
}

export function replaceCharAt(str: string, index: number, replacement: string): string {
  return str.slice(0, index) + replacement + str.slice(index + 1);
}
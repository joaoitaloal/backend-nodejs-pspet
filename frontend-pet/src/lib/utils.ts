import axios from "axios";
import type { Aluno, Prova, Reading } from "./interfaces";

// Isso tem que ser mudado pra uma requisição pro backend
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

export const ID_ERROS = new Map([
    [0, "Não houve erro"],
    [1, "Erro de leitura do código Aztec"],
    [2, "Imprecisão ou erro na identificação da área de leitura"],
    [3, "Erro fatal durante a leitura"]
]);

export function deleteProvaDatabase(item: Prova, url: string){
    return axios.delete(`${url}/${item.ID_PROVA}`, {
        data: item
    })
}

export function saveNewProvaDatabase(item: Prova, url: string){
    return axios.post(url, {
        data: item
    })
}

export function saveProvaDatabase(item: Prova, url: string){
    return axios.put(`${url}/${item.ID_PROVA}`, {
        data: item
    })
}

export function deleteAlunoDatabase(item: Aluno, url: string){
    return axios.delete(`${url}/${item.ID_ALUNO}`, {
        data: item
    })
}

export function saveNewAlunoDatabase(item: Aluno, url: string){
    return axios.post(url, {
        data: item
    })
}

export function saveAlunoDatabase(item: Aluno, url: string){
    return axios.put(`${url}/${item.ID_ALUNO}`, {
        data: item
    })
}

export function deleteLeituraDatabase(item: Reading, url: string){
    return axios.delete(`${url}/${item.ID_ALUNO}`, {
        data: item
    })
}

export function saveNewLeituraDatabase(item: Reading, url: string){
    return axios.post(url, {
        data: item
    })
}

export function saveLeituraDatabase(item: Reading, url: string){
    return axios.put(`${url}/${item.ID_ALUNO}/${item.ID_PROVA}`, {
        data: item
    })
}
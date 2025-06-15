export interface Reading{
    erro: number,
    id: number, //id aluno
    id_prova: number,
    nota: number,
    leitura: string,
    image_url: string
}

export interface Prova{
    id: number,
    gabarito: string
}

export interface Aluno{
    id: number,
    nome: string,
    escola: string
}
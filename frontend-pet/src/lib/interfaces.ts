export interface Reading{
    ERRO: number,
    ID_ALUNO: number,
    ID_PROVA: number,
    NOTA: number,
    ACERTOS: number,
    LEITURA: string,
    IMAGE_URL: string
}

export interface Prova{
    ID_PROVA: number,
    GABARITO: string
}

export interface Aluno{
    ID_ALUNO: number,
    NOME: string,
    ESCOLA: string
}
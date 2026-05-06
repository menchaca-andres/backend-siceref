export interface Raza {
    id_raza: number
    id_esp: number
    nom_raza: string
}

export interface CreateRazaDto {
    id_esp: number
    nom_raza: string
}

export interface UpdateRazaDto {
    id_esp?: number
    nom_raza?: string
}

export interface Raza {
    id_raza: number
    id_espe: number
    nom_raza: string
}

export interface CreateRazaDto {
    id_espe: number
    nom_raza: string
}

export interface UpdateRazaDto {
    id_espe?: number
    nom_raza?: string
}
export interface Mascota {
    id_ani: number
    nom_mascot: string
    fechanac_mascot: Date | string
    esteril_mascot: boolean
    sexo_mascot: string
    caract_mascot: string
    fechaing_mascot: Date
    id_raza: number
}

export interface CreateMascotaDto {
    nom_mascot: string
    fechanac_mascot: Date
    esteril_mascot: boolean
    sexo_mascot: string
    caract_mascot: string
    id_raza: number
}

export interface UpdateMascotaDto {
    nom_mascot?: string
    fechanac_mascot?: Date | string
    esteril_mascot?: boolean
    sexo_mascot?: string
    caract_mascot?: string
    id_raza?: number
}

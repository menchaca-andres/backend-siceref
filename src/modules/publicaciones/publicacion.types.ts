export interface Publicacion {
    id_publi: number
    fechapubli: Date | string
    estad_publ: boolean
    id_ani: number
    id_ref: number
}

export interface CreatePublicacionDto {
    id_ani: number | string
    id_ref?: number | string
    estad_publ?: boolean | string
}

export interface UpdatePublicacionDto {
    id_ani?: number | string
    id_ref?: number | string
    estad_publ?: boolean | string
}

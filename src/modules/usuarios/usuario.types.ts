export interface Usuario {
    id_usu: number
    img_usu: string | null
    nom_usu: string
    apell_usu: string
    fecnac_usu: Date | string
    numcel_usu: string
    email_usu: string
    id_rol: number
    id_ref: number | null
}

export interface CreateUsuarioDto {
    img_usu?: string
    nom_usu: string
    apell_usu: string
    fecnac_usu: Date
    numcel_usu: string
    email_usu: string
    pass_usu: string
    id_rol: number | string
    id_ref?: number | string | null
}

export interface UpdateUsuarioDto {
    img_usu?: string
    nom_usu?: string
    apell_usu?: string
    fecnac_usu?: Date | string
    numcel_usu?: string
    email_usu?: string
    pass_usu?: string
    id_rol?: number | string
    id_ref?: number | string | null
}

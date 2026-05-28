export interface LoginDto {
    email_usu: string
    pass_usu: string
}

export interface JwtPayload {
    id_usu: number
    id_rol: number
    nom_rol: string
    id_ref: number | null
}

export interface RegisterDto {
    img_usu?: string
    nom_usu: string
    apell_usu: string
    email_usu: string
    pass_usu: string
    numcel_usu: string
    fecnac_usu: Date | string
}

export interface RegisterWorkerDto extends RegisterDto {
    id_ref: number | string
}

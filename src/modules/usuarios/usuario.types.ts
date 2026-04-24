export interface Usuario {
    id_usuario: number
    id_rol: number
    id_refug: number
    telf_usuario: string
    corr_usuario: string
    nom_usuario: string
    apell_usuario: string
    fenac_usuario: Date
    gen_usuario: boolean
    direc_usuario: string
}

export interface CreateUsuarioDto {
    id_rol: number
    id_refug: number
    telf_usuario: string
    corr_usuario: string
    contra_usuario: string
    nom_usuario: string
    apell_usuario: string
    fenac_usuario: Date
    gen_usuario: boolean
    direc_usuario: string
}

export interface UpdateUsuarioDto {
    telf_usuario?: string
    corr_usuario?: string
    nom_usuario?: string
    apell_usuario?: string
    direc_usuario?: string
}
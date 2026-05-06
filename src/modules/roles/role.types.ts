export interface Role {
    id_rol: number
    codigo: string
    nom_rol: string
    descrip_rol: string
}

export interface CreateRoleDto {
    codigo: string
    nom_rol: string
    descrip_rol: string
}

export interface UpdateRoleDto {
    codigo?: string
    nom_rol?: string
    descrip_rol?: string
}

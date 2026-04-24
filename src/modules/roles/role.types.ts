export interface Role {
    id_rol: number
    nom_rol: string
}

export interface CreateRoleDto {
    nom_rol: string
}

export interface UpdateRoleDto {
    nom_rol?: string
}
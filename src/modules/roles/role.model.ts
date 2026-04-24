import { pool } from '../../config/database'
import { CreateRoleDto, UpdateRoleDto } from './role.types'

export const RoleModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM ROLES')
        return result.rows
    },

    findById: async (id: number) => {
        const result = await pool.query('SELECT * FROM ROLES WHERE id_rol = $1', [id])
        return result.rows[0]
    },

    create: async (data: CreateRoleDto) => {
        const result = await pool.query(
            'INSERT INTO ROLES (nom_rol) VALUES ($1) RETURNING *',
            [data.nom_rol]
        )
        return result.rows[0]
    },

    update: async (id: number, data: UpdateRoleDto) => {
        const result = await pool.query(
            'UPDATE ROLES SET nom_rol = $1 WHERE id_rol = $2 RETURNING *',
            [data.nom_rol, id]
        )
        return result.rows[0]
    },

    delete: async (id: number) => {
        const result = await pool.query(
            'DELETE FROM ROLES WHERE id_rol = $1 RETURNING *',
            [id]
        )
        return result.rows[0]
    },
}
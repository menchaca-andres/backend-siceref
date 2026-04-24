import { pool } from '../../config/database'
import { CreateEspecieDto, UpdateEspecieDto } from './especie.types'

export const EspecieModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM ESPECIES')
        return result.rows
    },

    findById: async (id: number) => {
        const result = await pool.query('SELECT * FROM ESPECIES WHERE id_espe = $1', [id])
        return result.rows[0]
    },

    create: async (data: CreateEspecieDto) => {
        const result = await pool.query(
            'INSERT INTO ESPECIES (nom_espe) VALUES ($1) RETURNING *',
            [data.nom_espe]
        )
        return result.rows[0]
    },

    update: async (id: number, data: UpdateEspecieDto) => {
        const result = await pool.query(
            'UPDATE ESPECIES SET nom_espe = $1 WHERE id_espe = $2 RETURNING *',
            [data.nom_espe, id]
        )
        return result.rows[0]
    },

    delete: async (id: number) => {
        const result = await pool.query(
            'DELETE FROM ESPECIES WHERE id_espe = $1 RETURNING *',
            [id]
        )
        return result.rows[0]
    },
}
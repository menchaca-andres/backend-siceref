import { pool } from '../../config/database'
import { CreateRazaDto, UpdateRazaDto } from './raza.types'

export const RazaModel = {
    findAll: async () => {
        const result = await pool.query(`
      SELECT r.*, e.nom_espe 
      FROM RAZAS r
      JOIN ESPECIES e ON r.id_espe = e.id_espe
    `)
        return result.rows
    },

    findById: async (id: number) => {
        const result = await pool.query(`
      SELECT r.*, e.nom_espe 
      FROM RAZAS r
      JOIN ESPECIES e ON r.id_espe = e.id_espe
      WHERE r.id_raza = $1
    `, [id])
        return result.rows[0]
    },

    create: async (data: CreateRazaDto) => {
        const result = await pool.query(
            'INSERT INTO RAZAS (id_espe, nom_raza) VALUES ($1, $2) RETURNING *',
            [data.id_espe, data.nom_raza]
        )
        return result.rows[0]
    },

    update: async (id: number, data: UpdateRazaDto) => {
        const result = await pool.query(
            'UPDATE RAZAS SET id_espe = $1, nom_raza = $2 WHERE id_raza = $3 RETURNING *',
            [data.id_espe, data.nom_raza, id]
        )
        return result.rows[0]
    },

    delete: async (id: number) => {
        const result = await pool.query(
            'DELETE FROM RAZAS WHERE id_raza = $1 RETURNING *',
            [id]
        )
        return result.rows[0]
    },
}
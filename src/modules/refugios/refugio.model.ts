import { pool } from '../../config/database'
import { CreateRefugioDto, UpdateRefugioDto } from './refugio.types'

export const RefugioModel = {
    findAll: async () => {
        const result = await pool.query('SELECT * FROM REFUGIOS')
        return result.rows
    },

    findById: async (id: number) => {
        const result = await pool.query(
            'SELECT * FROM REFUGIOS WHERE id_refug = $1',
            [id]
        )
        return result.rows[0]
    },

    findByEmail: async (email: string) => {
        const result = await pool.query(
            'SELECT * FROM REFUGIOS WHERE corr_refug = $1',
            [email]
        )
        return result.rows[0]
    },

    create: async (data: CreateRefugioDto) => {
        const result = await pool.query(`
      INSERT INTO REFUGIOS
        (nom_refug, dir_refug, telf_refug, corr_refug, contra_refug, licencia_refug)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [
            data.nom_refug, data.dir_refug, data.telf_refug,
            data.corr_refug, data.contra_refug, data.licencia_refug
        ])
        return result.rows[0]
    },

    update: async (id: number, data: UpdateRefugioDto) => {
        const result = await pool.query(`
      UPDATE REFUGIOS SET
        nom_refug = $1, dir_refug = $2, telf_refug = $3,
        corr_refug = $4, licencia_refug = $5
      WHERE id_refug = $6
      RETURNING *
    `, [
            data.nom_refug, data.dir_refug, data.telf_refug,
            data.corr_refug, data.licencia_refug, id
        ])
        return result.rows[0]
    },

    delete: async (id: number) => {
        const result = await pool.query(
            'DELETE FROM REFUGIOS WHERE id_refug = $1 RETURNING *',
            [id]
        )
        return result.rows[0]
    },
}
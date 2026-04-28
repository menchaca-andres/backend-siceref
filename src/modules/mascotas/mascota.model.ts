import { pool } from '../../config/database'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'

export const MascotaModel = {
  findAll: async () => {
    const result = await pool.query(`
      SELECT m.*, r.nom_raza, e.nom_espe
      FROM MASCOTAS m
      JOIN RAZAS r ON m.id_raza = r.id_raza
      JOIN ESPECIES e ON r.id_espe = e.id_espe
    `)
    return result.rows
  },

  findById: async (id: number) => {
    const result = await pool.query(`
      SELECT m.*, r.nom_raza, e.nom_espe
      FROM MASCOTAS m
      JOIN RAZAS r ON m.id_raza = r.id_raza
      JOIN ESPECIES e ON r.id_espe = e.id_espe
      WHERE m.id_mascot = $1
    `, [id])
    return result.rows[0]
  },

  create: async (data: CreateMascotaDto) => {
    const result = await pool.query(`
      INSERT INTO MASCOTAS
        (id_raza, img_mascot, nom_mascot, edad_mascot,
         fenac_mascot, descrip_mascot, gen_mascot, esterilizado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [
      data.id_raza, data.img_mascot, data.nom_mascot, data.edad_mascot ?? null,
      data.fenac_mascot ?? null, data.descrip_mascot, data.gen_mascot, data.esterilizado
    ])
    return result.rows[0]
  },

  update: async (id: number, data: UpdateMascotaDto) => {
    const result = await pool.query(`
      UPDATE MASCOTAS SET
        img_mascot = $1, nom_mascot = $2, edad_mascot = $3,
        fenac_mascot = $4, descrip_mascot = $5, esterilizado = $6
      WHERE id_mascot = $7
      RETURNING *
    `, [
      data.img_mascot, data.nom_mascot, data.edad_mascot,
      data.fenac_mascot, data.descrip_mascot, data.esterilizado, id
    ])
    return result.rows[0]
  },

  delete: async (id: number) => {
    const result = await pool.query(
      'DELETE FROM MASCOTAS WHERE id_mascot = $1 RETURNING *',
      [id]
    )
    return result.rows[0]
  },
}
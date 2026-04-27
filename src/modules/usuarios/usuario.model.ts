import { pool } from '../../config/database'
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.types'

export const UsuarioModel = {
  findAll: async () => {
    const result = await pool.query(`
      SELECT u.id_usuario, u.nom_usuario, u.apell_usuario, u.corr_usuario,
             u.telf_usuario, u.direc_usuario, u.fenac_usuario, u.gen_usuario,
             r.nom_rol, ref.nom_refug
      FROM USUARIOS u
      JOIN ROLES r ON u.id_rol = r.id_rol
      JOIN REFUGIOS ref ON u.id_refug = ref.id_refug
    `)
    return result.rows
  },

  findById: async (id: number) => {
    const result = await pool.query(`
      SELECT u.*, r.nom_rol, ref.nom_refug
      FROM USUARIOS u
      JOIN ROLES r ON u.id_rol = r.id_rol
      JOIN REFUGIOS ref ON u.id_refug = ref.id_refug
      WHERE u.id_usuario = $1
    `, [id])
    return result.rows[0]
  },

  findByEmail: async (email: string) => {
    const result = await pool.query(
      'SELECT * FROM USUARIOS WHERE corr_usuario = $1',
      [email]
    )
    return result.rows[0]
  },

  create: async (data: CreateUsuarioDto) => {
    const result = await pool.query(`
      INSERT INTO USUARIOS 
        (id_rol, id_refug, telf_usuario, corr_usuario, contra_usuario,
         nom_usuario, apell_usuario, fenac_usuario, gen_usuario, direc_usuario)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `, [
      data.id_rol, data.id_refug, data.telf_usuario, data.corr_usuario,
      data.contra_usuario, data.nom_usuario, data.apell_usuario,
      data.fenac_usuario, data.gen_usuario, data.direc_usuario
    ])
    return result.rows[0]
  },

  update: async (id: number, data: UpdateUsuarioDto) => {
    const result = await pool.query(`
      UPDATE USUARIOS SET
        telf_usuario = $1, corr_usuario = $2,
        nom_usuario = $3, apell_usuario = $4, direc_usuario = $5
      WHERE id_usuario = $6
      RETURNING *
    `, [
      data.telf_usuario, data.corr_usuario,
      data.nom_usuario, data.apell_usuario,
      data.direc_usuario, id
    ])
    return result.rows[0]
  },

  delete: async (id: number) => {
    const result = await pool.query(
      'DELETE FROM USUARIOS WHERE id_usuario = $1 RETURNING *',
      [id]
    )
    return result.rows[0]
  },
}
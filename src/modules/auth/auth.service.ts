import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../../config/database'
import { env } from '../../config/env'
import { LoginDto, JwtPayload, RegisterDto, RegisterWorkerDto } from './auth.types'

export const AuthService = {
    login: async (data: LoginDto) => {
        const result = await pool.query(`
      SELECT u.*, r.nom_rol
      FROM USUARIOS u
      JOIN ROLES r ON u.id_rol = r.id_rol
      WHERE u.corr_usuario = $1
    `, [data.corr_usuario])

        const usuario = result.rows[0]
        if (!usuario) throw new Error('Correo o contraseña incorrectos')

        const passwordValido = await bcrypt.compare(data.contra_usuario, usuario.contra_usuario)
        if (!passwordValido) throw new Error('Correo o contraseña incorrectos')

        const payload: JwtPayload = {
            id_usuario: usuario.id_usuario,
            id_rol: usuario.id_rol,
            nom_rol: usuario.nom_rol,
            id_refug: usuario.id_refug,
        }

        const token = jwt.sign(payload, env.jwt.secret, {
            expiresIn: env.jwt.expiresIn,
        })

        return {
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nom_usuario: usuario.nom_usuario,
                apell_usuario: usuario.apell_usuario,
                corr_usuario: usuario.corr_usuario,
                nom_rol: usuario.nom_rol,
                id_refug: usuario.id_refug,
            }
        }
    },

    register: async (data: RegisterDto) => {
        const existe = await pool.query(
            'SELECT * FROM USUARIOS WHERE corr_usuario = $1',
            [data.corr_usuario]
        )
        if (existe.rows[0]) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.contra_usuario, 10)

        const result = await pool.query(`
    INSERT INTO USUARIOS
      (id_rol, id_refug, nom_usuario, apell_usuario, corr_usuario,
       contra_usuario, telf_usuario, fenac_usuario, gen_usuario, direc_usuario)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
  `, [
            4, null, data.nom_usuario, data.apell_usuario, data.corr_usuario,
            hashPassword, data.telf_usuario, data.fenac_usuario,
            data.gen_usuario, data.direc_usuario
        ])

        return result.rows[0]
    },

    registerWorker: async (data: RegisterWorkerDto, adminRefugId: number | null) => {
        // Verificar que el trabajador pertenezca al mismo refugio del admin
        if (data.id_refug !== adminRefugId) {
            throw new Error('No puedes registrar trabajadores en otro refugio')
        }

        const existe = await pool.query(
            'SELECT * FROM USUARIOS WHERE corr_usuario = $1',
            [data.corr_usuario]
        )
        if (existe.rows[0]) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.contra_usuario, 10)

        const result = await pool.query(`INSERT INTO USUARIOS
        (id_rol, id_refug, nom_usuario, apell_usuario, corr_usuario,
        contra_usuario, telf_usuario, fenac_usuario, gen_usuario, direc_usuario)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`, [
            3, data.id_refug, data.nom_usuario, data.apell_usuario, data.corr_usuario,
            hashPassword, data.telf_usuario, data.fenac_usuario,
            data.gen_usuario, data.direc_usuario
        ])

        return result.rows[0]
    },

    registerSuperadmin: async (data: RegisterDto) => {
        const existe = await pool.query(
            'SELECT * FROM USUARIOS WHERE corr_usuario = $1',
            [data.corr_usuario]
        )
        if (existe.rows[0]) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.contra_usuario, 10)

        const result = await pool.query(`INSERT INTO USUARIOS
        (id_rol, id_refug, nom_usuario, apell_usuario, corr_usuario,
        contra_usuario, telf_usuario, fenac_usuario, gen_usuario, direc_usuario)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`, [
            1, null, data.nom_usuario, data.apell_usuario, data.corr_usuario,
            hashPassword, data.telf_usuario, data.fenac_usuario,
            data.gen_usuario, data.direc_usuario
        ])

        return result.rows[0]
    },
}
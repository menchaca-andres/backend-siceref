INSERT INTO permisos (codigo, nombre) VALUES
('logs:obtener', 'Obtener logs de auditoría'),
('reportes:obtener', 'Obtener reportes del sistema'),
('reportes:obtener:propio', 'Obtener reportes del refugio propio')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
JOIN permisos p ON p.codigo = 'reportes:obtener:propio'
WHERE r.codigo = 'admin-refugio'
ON CONFLICT DO NOTHING;

INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
CROSS JOIN permisos p
WHERE r.codigo = 'admin-sistema'
  AND p.codigo IN ('logs:obtener', 'reportes:obtener', 'reportes:obtener:propio')
ON CONFLICT DO NOTHING;

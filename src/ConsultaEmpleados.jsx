import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// Función para calcular tiempo trabajado
function calcularTiempoTrabajado(fechaIngreso) {
  const inicio = dayjs(fechaIngreso);
  const hoy = dayjs();
  const totalDias = hoy.diff(inicio, 'day');

  const años = Math.floor(totalDias / 365);
  const meses = Math.floor((totalDias % 365) / 30);
  const dias = totalDias % 30;

  if (años > 0) {
    return `${años} AÑO(S), ${meses} MES(ES)`;
  } else {
    return `${meses} MES(ES), ${dias} DÍA(S)`;
  }
}

export default function ConsultaEmpleados({
  empleados,
  filtro,
  setFiltro,
  filtrar,
  setView,
  setEmpleadoSeleccionado,
  usuario
}) {
  // Filtrado según rol del usuario
  const empleadosFiltrados = empleados
    .filter(emp => {
      if (usuario.rol === 'superusuario') return true;
      return emp.creado_por === usuario.id || emp.sucursal === usuario.sucursal;
    })
    .filter(filtrar)
    .sort((a, b) => a.apellido_paterno.localeCompare(b.apellido_paterno));

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={() => setView("dashboard")} className="mb-4 text-green-700 underline">← VOLVER AL INICIO</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">CONSULTA DE EMPLEADOS</h2>
      <input
        type="text"
        className="p-2 mb-4 w-full max-w-md border rounded"
        placeholder="BUSCAR POR CUALQUIER CAMPO"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <div className="grid gap-4">
        {empleadosFiltrados.map((emp) => (
          <div
            key={emp.id}
            onClick={() => {
              setEmpleadoSeleccionado(emp);
              setView("cardex");
            }}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer space-y-2 flex items-center gap-4"
          >
            {emp.foto_url && (
              <img
                src={emp.foto_url}
                alt="FOTO DEL EMPLEADO"
                className="w-20 h-20 object-cover rounded-full border"
              />
            )}
            <div>
              <div className="font-bold text-lg text-green-800">
                👤 {(emp.nombres || '').toUpperCase()} {(emp.apellido_paterno || '').toUpperCase()} {(emp.apellido_materno || '').toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">
                🧾 NÚMERO: {(emp.numero_empleado || '').toString().toUpperCase()} • SEXO: {(emp.sexo || '').toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">
                🧑‍💼 PUESTO: {(emp.puesto || '').toUpperCase()} • 🏢 SUCURSAL: {(emp.sucursal || '').toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">
                💵 SUELDO: ${emp.sueldo_quincenal} • EXTRAS: ${emp.horas_extras}
              </div>
              <div className="text-sm text-gray-600">
                📅 INGRESO: {(emp.fecha_ingreso || '').toUpperCase()}
              </div>
              <div className="text-sm text-blue-600">
                ⏳ TIEMPO TRABAJADO: {emp.fecha_ingreso ? calcularTiempoTrabajado(emp.fecha_ingreso) : 'SIN FECHA'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

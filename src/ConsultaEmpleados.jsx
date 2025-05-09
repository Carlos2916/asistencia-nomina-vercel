import React from 'react';

export default function ConsultaEmpleados({
  empleados,
  filtro,
  setFiltro,
  filtrar,
  setView,
  setEmpleadoSeleccionado
}) {
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={() => setView("dashboard")} className="mb-4 text-green-700 underline">← Volver al inicio</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Consulta de empleados</h2>
      <input
        type="text"
        className="p-2 mb-4 w-full max-w-md border rounded"
        placeholder="Buscar por cualquier campo"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <div className="grid gap-4">
        {empleados.filter(filtrar).map((emp) => (
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
                alt="Foto del empleado"
                className="w-20 h-20 object-cover rounded-full border"
              />
            )}
            <div>
              <div className="font-bold text-lg text-green-800">
                👤 {emp.nombres} {emp.apellido_paterno} {emp.apellido_materno}
              </div>
              <div className="text-sm text-gray-600">
                🧾 Número: {emp.numero_empleado} • Sexo: {emp.sexo}
              </div>
              <div className="text-sm text-gray-600">
                🧑‍💼 Puesto: {emp.puesto} • 🏢 Sucursal: {emp.sucursal}
              </div>
              <div className="text-sm text-gray-600">
                💵 Sueldo: ${emp.sueldo_quincenal} • Extras: ${emp.horas_extras}
              </div>
              <div className="text-sm text-gray-600">
                📅 Ingreso: {emp.fecha_ingreso}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  const [nuevaFoto, setNuevaFoto] = useState(null); // 👈 Agregado al inicio del componente

  if (view === "cardex" && empleadoSeleccionado) {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <button onClick={() => setView("consulta_empleados")} className="mb-4 text-green-700 underline">← Volver</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Editar Empleado</h2>
        <div className="grid gap-4 max-w-xl">
          {empleadoSeleccionado.foto_url && (
            <div className="mb-4">
              <img
                src={empleadoSeleccionado.foto_url}
                alt="Foto del empleado"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
          <label className="text-sm font-medium text-gray-700">Actualizar o agregar nueva foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNuevaFoto(e.target.files[0])}
          />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.numero_empleado} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, numero_empleado: e.target.value })} placeholder="Número de empleado" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.nombres} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, nombres: e.target.value })} placeholder="Nombre(s)" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.apellido_paterno} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, apellido_paterno: e.target.value })} placeholder="Apellido paterno" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.apellido_materno} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, apellido_materno: e.target.value })} placeholder="Apellido materno" />
          <select className="p-2 border rounded" value={empleadoSeleccionado.sucursal} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, sucursal: e.target.value })}>
            {sucursales.map((suc) => <option key={suc} value={suc}>{suc}</option>)}
          </select>
          <input type="date" className="p-2 border rounded" value={empleadoSeleccionado.fecha_ingreso} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, fecha_ingreso: e.target.value })} />
          <input type="number" className="p-2 border rounded" value={empleadoSeleccionado.sueldo_quincenal} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, sueldo_quincenal: e.target.value })} placeholder="Sueldo quincenal" />
          <input type="number" className="p-2 border rounded" value={empleadoSeleccionado.horas_extras} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, horas_extras: e.target.value })} placeholder="Horas extras" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.puesto} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, puesto: e.target.value })} placeholder="Puesto" />
          <button onClick={actualizarEmpleado} className="bg-green-700 text-white p-2 rounded hover:bg-green-800">Guardar cambios</button>
          <button onClick={eliminarEmpleado} className="bg-red-600 text-white p-2 rounded hover:bg-red-700">Eliminar empleado</button>
        </div>
      </div>
    );
  }

  const actualizarEmpleado = async () => {
    let foto_url = empleadoSeleccionado.foto_url;

    if (nuevaFoto) {
      const nombreArchivo = `${empleadoSeleccionado.numero_empleado}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("empleadosfotos")
        .upload(nombreArchivo, nuevaFoto, { upsert: true });

      if (uploadError) {
        alert("Error al subir la nueva foto");
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("empleadosfotos")
        .getPublicUrl(nombreArchivo);

      foto_url = publicUrl;
    }

    const actualizado = { ...empleadoSeleccionado, foto_url };

    const { error } = await supabase
      .from("empleados")
      .update(actualizado)
      .eq("id", empleadoSeleccionado.id);

    if (error) {
      alert("Error al actualizar");
    } else {
      alert("Empleado actualizado");
      setEmpleadoSeleccionado(null);
      cargarEmpleados();
      setView("consulta_empleados");
    }
  };

const handleAltaEmpleado = async () => {
  if (!empleadoFoto) return alert("Por favor selecciona una foto");

  const nombreArchivo = `${empleado.numero_empleado}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("empleados-fotos")
    .upload(nombreArchivo, empleadoFoto, { upsert: true });

  if (uploadError) {
    console.log(uploadError);
    return alert("Error al subir la foto");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("empleados-fotos")
    .getPublicUrl(nombreArchivo);

  const nuevoEmpleado = { ...empleado, foto_url: publicUrl };

  const { error } = await supabase.from("empleados").insert([nuevoEmpleado]);

  if (error) {
    console.log("Error Supabase:", error);
    alert("Error al guardar empleado");
  } else {
    alert("Empleado guardado correctamente");
    setView("dashboard");
    setEmpleado({
      numero_empleado: "",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      sucursal: "Cabos",
      fecha_ingreso: "",
      sueldo_quincenal: "",
      horas_extras: "",
      puesto: "",
    });
    setEmpleadoFoto(null);
  }
};

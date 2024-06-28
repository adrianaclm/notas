const localStorage = window.localStorage; // Importar localStorage
const nuevaNotaInput = document.querySelector("#nueva-nota-texto");
const crearNotaButton = document.querySelector(".nueva-nota button"); // Seleccionar por clase
const listaNotas = document.querySelector(".lista-notas");

let crearNuevaNotaTimeout;

// Función para crear una nueva nota
function crearNuevaNota() {
  const textoNota = nuevaNotaInput.value.trim(); // Trim para eliminar espacios en blanco

  if (textoNota) {
    const nuevaNota = document.createElement("div");
    nuevaNota.classList.add("nota");

    const notaTitulo = document.createElement("p");
    notaTitulo.textContent = textoNota;
    notaTitulo.classList.add("notaP");

    const botonBorrar = document.createElement("button");
    botonBorrar.textContent = "Borrar";
    botonBorrar.classList.add("boton-borrar"); // Aplicar la clase CSS
    botonBorrar.addEventListener("click", eliminarNota);

    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("boton-editar");
    botonEditar.addEventListener("click", editarNota);

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btnContainer");
    btnContainer.appendChild(botonBorrar);
    btnContainer.appendChild(botonEditar);

    const notasAlmacenadas = localStorage.getItem("notas") || "[]"; // Obtener notas o array vacío
    const notasParseadas = JSON.parse(notasAlmacenadas); // Convertir JSON a array
    const notaObj = { titulo: textoNota }; // Crear objeto nota
    notasParseadas.push(notaObj); // Agregar la nueva nota al array
    const notasString = JSON.stringify(notasParseadas); // Convertir array a JSON

    clearTimeout(crearNuevaNotaTimeout); // Limpiar la llamada anterior

    crearNuevaNotaTimeout = setTimeout(() => {
      localStorage.setItem("notas", notasString); // Almacenar en localStorage

      listaNotas.appendChild(nuevaNota);
      nuevaNota.appendChild(notaTitulo);
      nuevaNota.appendChild(btnContainer);
      nuevaNotaInput.value = ""; // Limpiar el campo de entrada
    }, 200); // Ajusta
  }
}

// Asignar evento al botón "Crear"
if (crearNotaButton) {
  crearNotaButton.addEventListener("click", crearNuevaNota);
} else {
  console.error("No se encontró el botón 'Crear'");
}

function eliminarNota(event) {
  const nota = event.target.closest(".nota");
  const tituloNota = nota.querySelector(".notaP").textContent; // Obtener el título de la nota

  const notasAlmacenadas = localStorage.getItem("notas") || "[]";
  const notasParseadas = JSON.parse(notasAlmacenadas);
  const indiceNota = notasParseadas.findIndex(
    (nota) => nota.titulo === tituloNota
  );

  if (indiceNota !== -1) {
    // Si la nota existe
    notasParseadas.splice(indiceNota, 1); // Eliminar la nota del array
    const notasString = JSON.stringify(notasParseadas);
    localStorage.setItem("notas", notasString); // Actualizar localStorage
  }

  listaNotas.removeChild(nota);
}

function editarNota(event) {
  const nota = event.target.closest(".nota");
  const notaTitulo = nota.querySelector(".notaP");

  const nuevoTexto = prompt(
    "Edita el texto de la nota:",
    notaTitulo.textContent
  );

  if (nuevoTexto) {
    const notasAlmacenadas = localStorage.getItem("notas") || "[]";
    const notasParseadas = JSON.parse(notasAlmacenadas);
    const indiceNota = notasParseadas.findIndex(
      (nota) => nota.titulo === notaTitulo.textContent
    );

    if (indiceNota !== -1) {
      notasParseadas[indiceNota].titulo = nuevoTexto; // Actualizar el título en el array
      const notasString = JSON.stringify(notasParseadas);
      localStorage.setItem("notas", notasString); // Actualizar localStorage
      notaTitulo.textContent = nuevoTexto; // Actualizar el texto en el DOM
    }
  }
}

function cargarNotas() {
  const notasAlmacenadas = localStorage.getItem("notas"); // Obtener notas del localStorage
  if (notasAlmacenadas) {
    const notasParseadas = JSON.parse(notasAlmacenadas); // Convertir JSON a array
    notasParseadas.forEach((nota) => {
      crearNotaHTML(nota); // Crear elemento HTML para cada nota
    });
  }
}

function crearNotaHTML(nota) {
  const nuevaNota = document.createElement("div");
  nuevaNota.classList.add("nota");

  const notaTitulo = document.createElement("p");
  notaTitulo.textContent = nota.titulo;
  notaTitulo.classList.add("notaP");

  const botonBorrar = document.createElement("button");
  botonBorrar.textContent = "Borrar";
  botonBorrar.classList.add("boton-borrar");
  botonBorrar.addEventListener("click", eliminarNota);

  const botonEditar = document.createElement("button");
  botonEditar.textContent = "Editar";
  botonEditar.classList.add("boton-editar");
  botonEditar.addEventListener("click", editarNota);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btnContainer");
  btnContainer.appendChild(botonBorrar);
  btnContainer.appendChild(botonEditar);

  listaNotas.appendChild(nuevaNota);
  nuevaNota.appendChild(notaTitulo);
  nuevaNota.appendChild(btnContainer);
}

document.addEventListener("DOMContentLoaded", cargarNotas);

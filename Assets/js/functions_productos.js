//funciones productos
function openModal() {
	rowTable = "";
	document.querySelector("#idProducto").value = "";
	document
		.querySelector(".modal-header")
		.classList.replace("headerUpdate", "headerRegister");
	document
		.querySelector("#btnActionForm")
		.classList.replace("btn-info", "btn-primary");
	document.querySelector("#btnText").innerHTML = "Guardar";
	document.querySelector("#titleModal").innerHTML = "Nuevo Producto";
	document.querySelector("#formProductos").reset();
	document.querySelector("#divBarCode").classList.add("notblock");
	document.querySelector("#containerGallery").classList.add("notblock");
	document.querySelector("#containerImages").innerHTML = "";
	$("#modalFormProductos").modal("show");
}

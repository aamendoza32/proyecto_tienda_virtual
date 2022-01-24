//funciones productos
tinymce.init({
	selector: "#txtDescripcion",
	width: "100%",
	height: 400,
	statubar: true,
	plugins: [
		"advlist autolink link image lists charmap print preview hr anchor pagebreak",
		"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
		"save table contextmenu directionality emoticons template paste textcolor",
	],
	toolbar:
		"insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",
});

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

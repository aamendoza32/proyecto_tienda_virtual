//funciones productos
document.write(
	`<script src="${base_url}/Assets/js/plugins/JsBarcode.all.min.js"></script>`
);
let tableProductos;
let rowTable = "";
$(document).on("focusin", function (e) {
	if ($(e.target).closest(".tox-dialog").length) {
		e.stopImmediatePropagation();
	}
});

tableProductos = $("#tableProductos").dataTable({
	aProcessing: true,
	aServerSide: true,
	language: {
		url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json",
	},
	ajax: {
		url: " " + base_url + "/Productos/getProductos",
		dataSrc: "",
	},
	columns: [
		{ data: "idproducto" },
		{ data: "codigo" },
		{ data: "nombre" },
		{ data: "stock" },
		{ data: "precio" },
		{ data: "status" },
		{ data: "options" },
	],
	columnDefs: [
		{ className: "textcenter", targets: [3] },
		{ className: "textright", targets: [4] },
		{ className: "textcenter", targets: [5] },
	],
	dom: "lBfrtip",
	buttons: [
		{
			extend: "copyHtml5",
			text: "<i class='far fa-copy'></i> Copiar",
			titleAttr: "Copiar",
			className: "btn btn-secondary",
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5],
			},
		},
		{
			extend: "excelHtml5",
			text: "<i class='fas fa-file-excel'></i> Excel",
			titleAttr: "Esportar a Excel",
			className: "btn btn-success",
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5],
			},
		},
		{
			extend: "pdfHtml5",
			text: "<i class='fas fa-file-pdf'></i> PDF",
			titleAttr: "Esportar a PDF",
			className: "btn btn-danger",
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5],
			},
		},
		{
			extend: "csvHtml5",
			text: "<i class='fas fa-file-csv'></i> CSV",
			titleAttr: "Esportar a CSV",
			className: "btn btn-info",
			exportOptions: {
				columns: [0, 1, 2, 3, 4, 5],
			},
		},
	],
	resonsieve: "true",
	bDestroy: true,
	iDisplayLength: 10,
	order: [[0, "desc"]],
});
window.addEventListener(
	"load",
	function () {
		if (document.querySelector("#formProductos")) {
			let formProductos = document.querySelector("#formProductos");
			formProductos.onsubmit = function (e) {
				e.preventDefault();
				let strNombre = document.querySelector("#txtNombre").value;
				let intCodigo = document.querySelector("#txtCodigo").value;
				let strPrecio = document.querySelector("#txtPrecio").value;
				let intStock = document.querySelector("#txtStock").value;
				let intStatus = document.querySelector("#listStatus").value;
				if (
					strNombre == "" ||
					intCodigo == "" ||
					strPrecio == "" ||
					intStock == ""
				) {
					swal("Atención", "Todos los campos son obligatorios.", "error");
					return false;
				}
				if (intCodigo.length < 5) {
					swal(
						"Atención",
						"El código debe ser mayor que 5 dígitos.",
						"error"
					);
					return false;
				}
				divLoading.style.display = "flex";
				tinyMCE.triggerSave();
				let request = window.XMLHttpRequest
					? new XMLHttpRequest()
					: new ActiveXObject("Microsoft.XMLHTTP");
				let ajaxUrl = base_url + "/Productos/setProducto";
				let formData = new FormData(formProductos);
				request.open("POST", ajaxUrl, true);
				request.send(formData);
				request.onreadystatechange = function () {
					if (request.readyState == 4 && request.status == 200) {
						let objData = JSON.parse(request.responseText);
						if (objData.status) {
							swal("", objData.msg, "success");
							document.querySelector("#idProducto").value =
								objData.idproducto;
							document
								.querySelector("#containerGallery")
								.classList.remove("notblock");

							if (rowTable == "") {
								tableProductos.api().ajax.reload();
							} else {
								htmlStatus =
									intStatus == 1
										? '<span class="badge badge-success">Activo</span>'
										: '<span class="badge badge-danger">Inactivo</span>';
								rowTable.cells[1].textContent = intCodigo;
								rowTable.cells[2].textContent = strNombre;
								rowTable.cells[3].textContent = intStock;
								rowTable.cells[4].textContent = smony + strPrecio;
								rowTable.cells[5].innerHTML = htmlStatus;
								rowTable = "";
							}
						} else {
							swal("Error", objData.msg, "error");
						}
					}
					divLoading.style.display = "none";
					return false;
				};
			};
		}

		if (document.querySelector(".btnAddImage")) {
			let btnAddImage = document.querySelector(".btnAddImage");
			btnAddImage.onclick = function (e) {
				let key = Date.now();
				let newElement = document.createElement("div");
				newElement.id = "div" + key;
				newElement.innerHTML = `
            <div class="prevImage"></div>
            <input type="file" name="foto" id="img${key}" class="inputUploadfile">
            <label for="img${key}" class="btnUploadfile"><i class="fas fa-upload "></i></label>
            <button class="btnDeleteImage notblock" type="button" onclick="fntDelItem('#div${key}')"><i class="fas fa-trash-alt"></i></button>`;
				document.querySelector("#containerImages").appendChild(newElement);
				document.querySelector("#div" + key + " .btnUploadfile").click();
				fntInputFile();
			};
		}
		fntInputFile();
		fntCategorias();
	},
	false
);

if (document.querySelector("#txtCodigo")) {
	let inputCodigo = document.querySelector("#txtCodigo");
	inputCodigo.onkeyup = function () {
		if (inputCodigo.value.length >= 5) {
			document.querySelector("#divBarCode").classList.remove("notblock");
			fntBarcode();
		} else {
			document.querySelector("#divBarCode").classList.add("notblock");
		}
	};
}

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

function fntCategorias() {
	if (document.querySelector("#listCategoria")) {
		let ajaxUrl = base_url + "/Categorias/getSelectCategorias";
		let request = window.XMLHttpRequest
			? new XMLHttpRequest()
			: new ActiveXObject("Microsoft.XMLHTTP");
		request.open("GET", ajaxUrl, true);
		request.send();
		request.onreadystatechange = function () {
			if (request.readyState == 4 && request.status == 200) {
				document.querySelector("#listCategoria").innerHTML =
					request.responseText;
				$("#listCategoria").selectpicker("render");
			}
		};
	}
}

function fntBarcode() {
	let codigo = document.querySelector("#txtCodigo").value;
	JsBarcode("#barcode", codigo);
}

function fntPrintBarcode(area) {
	let elemntArea = document.querySelector(area);
	let vprint = window.open(" ", "popimpr", "height=400,width=600");
	vprint.document.write(elemntArea.innerHTML);
	vprint.document.close();
	vprint.print();
	vprint.close();
}

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

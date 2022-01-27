<?php
require_once("Models/TCategoria.php");
require_once("Models/TProducto.php");
require_once("Models/TCliente.php");
require_once("Models/LoginModel.php");

class Tienda extends Controllers
{
	use TCategoria, TProducto/*, TCliente*/;
	public $login;
	public function __construct()
	{
		parent::__construct();
		session_start();
		$this->login = new LoginModel();
	}

	public function tienda()
	{
		$data['page_tag'] = NOMBRE_EMPESA;
		$data['page_title'] = NOMBRE_EMPESA;
		$data['page_name'] = "tienda";
		//$data['productos'] = $this->getProductosT();
		$pagina = 1;
		$cantProductos = $this->cantProductos();
		$total_registro = $cantProductos['total_registro'];
		$desde = ($pagina - 1) * PROPORPAGINA;
		$total_paginas = ceil($total_registro / PROPORPAGINA);
		$data['productos'] = $this->getProductosPage($desde, PROPORPAGINA);
		//dep($data['productos']);exit;
		$data['pagina'] = $pagina;
		$data['total_paginas'] = $total_paginas;
		$data['categorias'] = $this->getCategorias();
		$this->views->getView($this, "tienda", $data);
	}

	public function categoria($params)
	{
		if (empty($params)) {
			header("Location:" . base_url());
		} else {

			$arrParams = explode(",", $params);
			$idcategoria = intval($arrParams[0]);
			$ruta = strClean($arrParams[1]);
			$pagina = 1;
			if (count($arrParams) > 2 and is_numeric($arrParams[2])) {
				$pagina = $arrParams[2];
			}

			$cantProductos = $this->cantProductos($idcategoria);
			$total_registro = $cantProductos['total_registro'];
			$desde = ($pagina - 1) * PROCATEGORIA;
			$total_paginas = ceil($total_registro / PROCATEGORIA);
			$infoCategoria = $this->getProductosCategoriaT($idcategoria, $ruta, $desde, PROCATEGORIA);
			$categoria = strClean($params);
			$data['page_tag'] = NOMBRE_EMPESA . " - " . $infoCategoria['categoria'];
			$data['page_title'] = $infoCategoria['categoria'];
			$data['page_name'] = "categoria";
			$data['productos'] = $infoCategoria['productos'];
			$data['infoCategoria'] = $infoCategoria;
			$data['pagina'] = $pagina;
			$data['total_paginas'] = $total_paginas;
			$data['categorias'] = $this->getCategorias();
			$this->views->getView($this, "categoria", $data);
		}
	}

	// CONFIGURACION DE PRODUCTO: GET PRODUCTO, RUTAS AMIGABLES
	public function producto($params)
	{
		if (empty($params)) {
			header("Location:" . base_url());
		} else {
			$arrParams = explode(",", $params);
			$idproducto = intval($arrParams[0]);
			$ruta = strClean($arrParams[1]);
			$infoProducto = $this->getProductoT($idproducto, $ruta);
			if (empty($infoProducto)) {
				header("Location:" . base_url());
			}
			$data['page_tag'] = NOMBRE_EMPESA . " - " . $infoProducto['nombre'];
			$data['page_title'] = $infoProducto['nombre'];
			$data['page_name'] = "producto";
			$data['producto'] = $infoProducto;
			$data['productos'] = $this->getProductosRandom($infoProducto['categoriaid'], 8, "r");
			$this->views->getView($this, "producto", $data);
		}
	}
}
<?php

class ProductosModel extends Mysql
{
    private $intIdProducto;
    private $strNombre;
    private $strDescripcion;
    private $intCodigo;
    private $intCategoriaId;
    private $intPrecio;
    private $intStock;
    private $intStatus;
    private $strRuta;
    private $strImagen;

    public function __construct()
    {
        parent::__construct();
    }

    public function selectProductos()
    {
        $sql = "SELECT p.idproducto,
							p.codigo,
							p.nombre,
							p.descripcion,
							p.categoriaid,
							c.nombre as categoria,
							p.precio,
							p.stock,
							p.status 
					FROM producto p 
					INNER JOIN categoria c
					ON p.categoriaid = c.idcategoria
					WHERE p.status != 0 ";
        $request = $this->select_all($sql);
        return $request;
    }

    public function insertProducto(string $nombre, string $descripcion, int $codigo, int $categoriaid, string $precio, int $stock, string $ruta, int $status)
    {
        $this->strNombre = $nombre;
        $this->strDescripcion = $descripcion;
        $this->intCodigo = $codigo;
        $this->intCategoriaId = $categoriaid;
        $this->strPrecio = $precio;
        $this->intStock = $stock;
        $this->strRuta = $ruta;
        $this->intStatus = $status;
        $return = 0;
        $sql = "SELECT * FROM producto WHERE codigo = '{$this->intCodigo}'";
        $request = $this->select_all($sql);
        if (empty($request)) {
            $query_insert  = "INSERT INTO producto(categoriaid,
														codigo,
														nombre,
														descripcion,
														precio,
														stock,
														ruta,
														status) 
								  VALUES(?,?,?,?,?,?,?,?)";
            $arrData = array(
                $this->intCategoriaId,
                $this->intCodigo,
                $this->strNombre,
                $this->strDescripcion,
                $this->strPrecio,
                $this->intStock,
                $this->strRuta,
                $this->intStatus
            );
            $request_insert = $this->insert($query_insert, $arrData);
            $return = $request_insert;
        } else {
            $return = "exist";
        }
        return $return;
    }
}
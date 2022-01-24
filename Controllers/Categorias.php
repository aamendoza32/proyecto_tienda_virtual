<?php
class Categorias extends Controllers
{
    public function __construct()
    {
        parent::__construct();
        session_start();
        //session_regenerate_id(true);
        if (empty($_SESSION['login'])) {
            header('Location: ' . base_url() . '/login');
            die();
        }
        getPermisos(MCATEGORIAS);
    }

    public function Categorias()
    {
        if (empty($_SESSION['permisosMod']['r'])) {
            header("Location:" . base_url() . '/dashboard');
        }
        $data['page_tag'] = "Categorias";
        $data['page_title'] = "CATEGORIAS <small>Tienda Virtual</small>";
        $data['page_name'] = "categorias";
        $data['page_functions_js'] = "functions_categorias.js";
        $this->views->getView($this, "categorias", $data);
    }

    public function setCategoria()
    {
        if ($_POST) {
            if (empty($_POST['txtNombre']) || empty($_POST['txtDescripcion']) || empty($_POST['listStatus'])) {
                $arrResponse = array("status" => false, "msg" => 'Datos incorrectos.');
            } else {

                $intIdcategoria = intval($_POST['idCategoria']);
                $strCategoria =  strClean($_POST['txtNombre']);
                $strDescipcion = strClean($_POST['txtDescripcion']);
                $intStatus = intval($_POST['listStatus']);

                $ruta = strtolower(clear_cadena($strCategoria));
                $ruta = str_replace(" ", "-", $ruta);

                $foto            = $_FILES['foto'];
                $nombre_foto     = $foto['name'];
                $type              = $foto['type'];
                $url_temp        = $foto['tmp_name'];
                $imgPortada     = 'portada_categoria.png';
                $request_cateria = "";
                if ($nombre_foto != '') {
                    $imgPortada = 'img_' . md5(date('d-m-Y H:i:s')) . '.jpg';
                }

                if ($intIdcategoria == 0) {
                    //Crear
                    if ($_SESSION['permisosMod']['w']) {
                        $request_cateria = $this->model->inserCategoria($strCategoria, $strDescipcion, $imgPortada, $ruta, $intStatus);
                        $option = 1;
                    }
                } else {
                    //Actualizar
                    if ($_SESSION['permisosMod']['u']) {
                        if ($nombre_foto == '') {
                            if ($_POST['foto_actual'] != 'portada_categoria.png' && $_POST['foto_remove'] == 0) {
                                $imgPortada = $_POST['foto_actual'];
                            }
                        }
                        $request_cateria = $this->model->updateCategoria($intIdcategoria, $strCategoria, $strDescipcion, $imgPortada, $ruta, $intStatus);
                        $option = 2;
                    }
                }
                if ($request_cateria > 0) {
                    if ($option == 1) {
                        $arrResponse = array('status' => true, 'msg' => 'Datos guardados correctamente.');
                        if ($nombre_foto != '') {
                            uploadImage($foto, $imgPortada);
                        }
                    } else {
                        $arrResponse = array('status' => true, 'msg' => 'Datos Actualizados correctamente.');
                        if ($nombre_foto != '') {
                            uploadImage($foto, $imgPortada);
                        }

                        if (($nombre_foto == '' && $_POST['foto_remove'] == 1 && $_POST['foto_actual'] != 'portada_categoria.png')
                            || ($nombre_foto != '' && $_POST['foto_actual'] != 'portada_categoria.png')
                        ) {
                            deleteFile($_POST['foto_actual']);
                        }
                    }
                } else if ($request_cateria == 'exist') {
                    $arrResponse = array('status' => false, 'msg' => '¡Atención! La categoría ya existe.');
                } else {
                    $arrResponse = array("status" => false, "msg" => 'No es posible almacenar los datos.');
                }
            }
            echo json_encode($arrResponse, JSON_UNESCAPED_UNICODE);
        }
        die();
    }
}
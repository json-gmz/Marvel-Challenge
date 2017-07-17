<?php
if ( isset($_POST) && !empty($_POST) && isset($_POST["action"]) && !empty($_POST["action"]) ) {
    switch ( $_POST["action"] ) {
        case "getmd5":
            $data = new data();
            echo $data->getmd5($_POST["ts"], $_POST["privateKey"], $_POST["publicKey"]);
            break;
        default:
            echo 0;
    }
} else { echo 0; }

class data {
    public function getmd5( $ts, $privateKey, $publicKey ) {
        return md5($ts.$privateKey.$publicKey);
    }
}
?>
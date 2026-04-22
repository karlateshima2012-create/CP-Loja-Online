<?php
/**
 * CP-Loja-Online — Entry Point Override
 * 
 * Este arquivo sobrescreve o default.php da Hostinger.
 * Redireciona imediatamente para o app React (index.html).
 */
header('Location: ./index.html', true, 302);
exit;

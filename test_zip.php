<?php
$sourceDocx = 'Bao_cao_tien_do_do_an_tuan_12.docx';
$destDocx = 'test_output.docx';
copy($sourceDocx, $destDocx);
$zip = new ZipArchive();
if ($zip->open($destDocx) === true) {
    echo "Files in archive:\n";
    for ($i = 0; $i < $zip->numFiles; $i++) {
        echo "- " . $zip->getNameIndex($i) . "\n";
    }
    $zip->close();
}
unlink($destDocx);

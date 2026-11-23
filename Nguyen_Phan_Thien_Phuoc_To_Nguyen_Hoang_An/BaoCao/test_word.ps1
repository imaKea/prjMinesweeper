$word = New-Object -ComObject Word.Application
Write-Host "WORD_VERSION:" $word.Version
$word.Quit()

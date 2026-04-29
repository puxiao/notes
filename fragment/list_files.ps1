# 列出当前目录下所有文件(不含子目录)，按照文件名递增排序，并写入到 name.txt
$output = "name.txt"
Get-ChildItem -File | 
    Where-Object { $_.Name -ne $output -and $_.Name -ne "list_files.ps1" } |
    Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(20) }) } |
    Select-Object -ExpandProperty Name |
    Set-Content -Path $output -Encoding UTF8
Write-Host "完成！文件名已写入 $output"

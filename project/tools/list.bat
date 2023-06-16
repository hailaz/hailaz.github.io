@echo off
setlocal enabledelayedexpansion
echo ^<!DOCTYPE HTML^> > list.html
echo ^<html^> > list.html
echo ^<head^> >> list.html
echo ^<title^>tool list^</title^> >> list.html
echo ^</head^> >> list.html

for  %%s in (*) do (
if not "%%s" == "list.html"  (
if not "%%s" == "list.bat"  (
echo ^<a href=^"/tools/%%s^"^>%%s^</a^>^</br^> >> list.html
)
)

)

echo ^</html^> >> list.html


pushd app\src\main\webapp
cmd /c ng build --configuration production
xcopy /y /s dist\open-booking\* ..\resources\static
popd

pushd app
cmd /c gradle clean jibDockerBuild
popd

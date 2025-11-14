# Iniciar backend en segundo plano
echo "Iniciando servidor de backend en el puerto 3000..."
(cd backend && node app.js &)

# Iniciar frontend en segundo plano
echo "Iniciando servidor de frontend en el puerto 4200..."
(cd frontend && npx ng serve &)

echo -e "\nEsperando a que el servidor de desarrollo del frontend esté listo..."
sleep 10

echo "¡Todo listo! Abriendo la aplicación en tu navegador..."
open http://localhost:4200
# Nota: En Linux, usa 'xdg-open' en lugar de 'open'
# Nota: En Windows, usa 'start' en lugar de 'open'
# Por ejemplo, para Linux:
# xdg-open http://localhost:4200
# Para Windows:
# start http://localhost:4200
    
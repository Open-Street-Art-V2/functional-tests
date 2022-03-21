echo "Authentification" > report.txt
node userLogin.js >> report.txt

echo $'\nRecherche' >> report.txt
node searchCityPage.js >> report.txt
node searchTitlePage.js >> report.txt
node searchArtistPage.js >> report.txt
echo "Authentification" > report.txt
node login.js >> report.txt

echo $'\nInscription' >> report.txt
node register.js >> report.txt

echo $'\nRecherche' >> report.txt
node searchCityPage.js >> report.txt
node searchTitlePage.js >> report.txt
node searchArtistPage.js >> report.txt
node searchUserPage.js >> report.txt

echo $'\nAdministration des oeuvres' >> report.txt
node adminArt.js >> report.txt

echo $'\nContribution d\'une oeuvre' >> report.txt
node userContribute.js 1 >> report.txt
node userContribute.js 2

echo $'\nAdmnistration des propositions' >> report.txt
node adminProposal.js >> report.txt
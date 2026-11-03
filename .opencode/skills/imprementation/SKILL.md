
GET http://10.60.110.45:9081/s2q/configuration-service/public/agences?lg_socid=13711124025984277964&length=3

Paramètres :
- lg_socid obligatoire
- search_value, start, length optionnels (length max 100)
Exemple réel retourné :

{
  "reponse": "success",
  "message": "3 agence(s) trouvée(s)",
  "data": [
    {
      "lg_ageid": "15311135020432961225",
      "str_agecode": "05001",
      "str_agedescription": "ABENGOUROU",
      "str_ageville": "Abengourou",
      "str_agelocalisation": null
    },
    {
      "lg_ageid": "15311135331855775207",
      "str_agecode": "01001",
      "str_agedescription": "ABIDJAN JOSEPH ANOMA (AGENCE PRINCIPALE)",
      "str_ageville": "Plateau",
      "str_agelocalisation": null
    },
  ]
}

-------------------------------

GET http://synapsepcdev07:9081/s2q/parametre-service/public/agenceprestations?lg_ageid=15311140506031233401
Paramètres :
- lg_ageid obligatoire
- lang optionnel (fr, en…)
Exemple réel retourné, raccourci à 1 service et 2 prestations sur les 18 ; les urlImage SVG en base64 sont tronquées :
{
  "reponse": "success",
  "message": "Prestations de l'agence groupées par service",
  "data": [
    {
      "service": {
        "lg_serid": "20261131553457634257",
        "str_sername": "Caisse",
        "str_prestype": "1",
        "urlImage": "data:image/svg+xml;base64,<BASE64_SVG_TRONQUE>"
      },
      "prestations": [
        {
          "lg_presid": "20261131558141345457",
          "str_presname": "Autres Opérations",
          "str_prestype": "1",
          "str_presdescription": "Autres opérations de la caisse",
          "urlImage": "data:image/svg+xml;base64,<BASE64_SVG_TRONQUE>"
        },
        {
          "lg_presid": "20261131553401145441",
          "str_presname": "Change",
          "str_prestype": "0",
          "str_presdescription": "services de change",
          "urlImage": "data:image/svg+xml;base64,<BASE64_SVG_TRONQUE>"
        }
      ]
    }
  ]
}

--------------------------

3. Liste minimale des gestionnaires
GET http://synapsepcdev07:9081/s2q/admin-service/public/gestionnaires?lg_ageid=13711151844929304482&lg_presid=20261131541258674703
Paramètres :
- lg_ageid obligatoire
- lg_presid obligatoire
- str_agrtype optionnel : 1 = caissière, 2 = gestionnaire
Exemple réel retourné :
{
  "reponse": "success",
  "status": "success",
  "message": "5 gestionnaire(s) trouvé(s)",
  "data": [
    {
      "lg_utiid": "20266221454697498321",
      "str_utifirstlastname": "Ezechiel YAO",
      "str_utipic": null,
      "str_rollibelle": "CONSEILLER 4",
      "type_role_libelle": "Gestionnaire"
    },
    {
      "lg_utiid": "20267301048518038790",
      "str_utifirstlastname": "Kouadio Kouamé Fabrice",
      "str_utipic": null,
      "str_rollibelle": "CONSEILLER 1",
      "type_role_libelle": "Gestionnaire"
    },
    {
      "lg_utiid": "20267301051494773670",
      "str_utifirstlastname": "User 2",
      "str_utipic": null,
      "str_rollibelle": "CONSEILLER 5",
      "type_role_libelle": "Gestionnaire"
    },
    {
      "lg_utiid": "20261061435141880813",
      "str_utifirstlastname": "User 3",
      "str_utipic": null,
      "str_rollibelle": "CONSEILLER 6",
      "type_role_libelle": "Gestionnaire"
    },
    {
      "lg_utiid": "20267139124673386756",
      "str_utifirstlastname": "Yigo Abdoul",
      "str_utipic": null,
      "str_rollibelle": "CONSEILLER 3",
      "type_role_libelle": "Gestionnaire"
    }
  ]
}



l'endpoin de la creation de ticket est :
//Prise de rendez-vous en ligne
> POST /s2q/admin-service/public/rendezvous HTTP/1.1
> Host: localhost:9081
> User-Agent: insomnia/13.4.0
> Content-Type: application/json
> Accept: /
> Content-Length: 446

| {
|   "lg_ageid": "13711151844929304482",
|   "lg_presid": "20261131541258674703",
|   "lg_usrid": "20267301143301350793",
|   "int_ticclient": "1",
|   "timeslot": {
| 		"day": "Mer",
| 		"date": "2026-11-04", 
| 		"time": "16:30" 
| 	},
|   "serviceName": "Assurance",
|   "str_ncompteclient": "",
|   "str_ticemail": "ivansalvine@gmail.com",
|   "str_ticlangueclient": "fr",
|   "str_ticnom": "Kouadio",
|   "str_ticprenoms": "Fabrice",
|   "str_ticphone": "+2250757764760"
| }
---------------------------------
{
	"reponse": "success",
	"message": "Demande de rendez-vous enregistree",
	"data": {
		"lg_rdvid": "20261131218313034215",
		"lg_ticid": "20261131218313035221",
		"lg_socid": "13711124025984277964",
		"lg_ageid": "13711151844929304482",
		"lg_presid": "20261131541258674703",
		"lg_usrid": "20267301143301350793",
		"lg_utiid": "20267301048518038790",
		"lg_agrid": "20267301112066989346",
		"dt_rdv": "2026-11-04T00:00:00.000Z",
		"hr_debut": "16:30:00",
		"hr_fin": "17:00:00",
		"str_rdvstatut": "pending",
		"str_rdvsource": "online",
		"str_rdvmotif": null,
		"str_rdvobservation": null,
		"dt_created": "2026-11-03T12:18:31.304Z",
		"dt_updated": null,
		"lg_uticreated": null,
		"lg_utiupdated": null,
		"dt_confirmed": null,
		"lg_uticonfirmed": null,
		"dt_cancelled": null,
		"lg_uticancelled": null,
		"str_rdvcancelreason": null,
		"str_ticnumero": "OAS003",
		"str_ticnom": "Kouadio",
		"str_ticprenoms": "Fabrice",
		"str_ticphone": "+2250757764760",
		"str_ticemail": "ivansalvine@gmail.com",
		"str_ticprocess": "EN_IMPRESSION",
		"str_ticstatut": "enable",
		"str_ticonline": "on",
		"dt_ticcreated": "2026-11-03T12:18:31.304Z",
		"dt_ticpriseticket": null,
		"dt_ticfile": null,
		"str_presname": "Assurance ",
		"str_sername": "Gestion des produits",
		"str_agedescription": "SIEGE",
		"str_agecode": "00001",
		"str_agephone": null,
		"str_agemail": null,
		"str_ageville": "ABIDJAN",
		"str_agelocalisation": null,
		"str_socname": "BNI",
		"str_soclogo": "CI092.png",
		"str_soccolor": "#23cd4d",
		"str_socmail": "bni@bni.com",
		"str_socaddress": "PLATEAU RUE ANOMA"
	}
}


============  services por le module nos agences =========
http://synapsepcdev07:9081/s2q/admin-service/public/agencesLive?lg_socid=13711124025984277964 

{
  "reponse": "success",
  "message": "75 agence(s) avec informations temps réel",
  "dt_updated": "2026-11-03T13:47:58.729Z",
  "data": [
    {
      "lg_ageid": "15311135020432961225",
      "str_agedescription": "ABENGOUROU",
      "str_agedistrict": "Abengourou",
      "str_agecommune": "Abengourou",
      "str_agelocalisation": null,
      "str_agehours": "Lun - Dim: 08h00 - 19h00",
      "str_ageopenuntil": "19:00",
      "str_agephone": "2735900093",
      "str_agestatus": "Ouvert",
      "int_agewaitminutes": 0,
      "str_agecurrentwaittime": "0 min",
      "int_agecountersactive": 3,
      "str_ageaffluence": "fluide",
      "str_agelatitude": "-3.487033",
      "str_agelongitude": "6.730081"
    },
    {
      "lg_ageid": "15311135331855775207",
      "str_agedescription": "ABIDJAN JOSEPH ANOMA (AGENCE PRINCIPALE)",
      "str_agedistrict": "Plateau",
      "str_agecommune": "Plateau",
      "str_agelocalisation": null,
      "str_agehours": "Lun - Dim: 08h00 - 19h00",
      "str_ageopenuntil": "19:00",
      "str_agephone": "2720315100",
      "str_agestatus": "Ouvert",
      "int_agewaitminutes": null,
      "str_agecurrentwaittime": "Indisponible",
      "int_agecountersactive": 0,
      "str_ageaffluence": "indisponible",
      "str_agelatitude": "-4.017083",
      "str_agelongitude": "5.320114"
    },]
}


tu peux ajouter ls_ageid pour avoir l'information specific d'une agence

GET http://synapsepcdev07:9081/s2q/admin-service/public/agencesLive?lg_socid=13711124025984277964&lg_ageid=13711151844929304482
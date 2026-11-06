# 📡 ENDPOINTS SATISFACTION À EXPOSER EN PUBLIC — S2Q Ticket en ligne (Web)

> Base URL : `http://SYNAPSEPCDEV07:9081/s2q`
> Société (BNI) : `lg_socid = 13711124025984277964`
> Source : module borne `D:\DOC\Synapse doc\SATISFACTION` (`src/services/app/api.js`)

---

## 1. Liste des émoticônes de satisfaction — OBLIGATOIRE

```
GET /s2q/parametre-service/satisfaction/listSatisfaction?lg_socid=13711124025984277964&search_value=&start=0&length=100&active_group=true
```

**Paramètres**
| Param | Type | Obligatoire | Description |
|---|---|---|---|
| `lg_socid` | string | ✅ | ID société |
| `active_group` | bool | ✅ (true) | Filtrer sur le groupe d'avis actif |
| `search_value`, `start`, `length` | — | optionnels | Recherche / pagination |

**Réponse attendue** (liste triée par `int_satisordre`)
```json
{
  "reponse": "success",
  "data": [
    {
      "lg_satisid": "20261015155721385372",
      "lg_socid": "13711124025984277964",
      "str_satislib": "Tres insatisfait",
      "str_satisimg": "tres-insatisfait.png",
      "str_satisimg_url": "/parametre-service/medias/getFile?filename=tres-insatisfait.png",
      "str_satiscolor": "#c0392b",
      "str_satiscolorsec": "#fdecea",
      "int_satistype": 5,
      "int_satisordre": 1,
      "int_satisnote": 1,
      "str_satisstatut": "enable"
    }
  ]
}
```

---

## 2. Justificatifs (motifs) d'une émoticône — OBLIGATOIRE

```
GET /s2q/parametre-service/justificatif/listJustificatif?lg_socid=13711124025984277964&lg_satisid=20261015155721385372&length=10000
```

**Paramètres**
| Param | Type | Obligatoire | Description |
|---|---|---|---|
| `lg_socid` | string | ✅ | ID société |
| `lg_satisid` | string | ✅ | ID de l'émoticône choisie |

**Réponse attendue**
```json
{
  "reponse": "success",
  "data": [
    {
      "lg_jusid": "20261015155721389080",
      "lg_satisid": "20261015155721385372",
      "str_jusdescription": "Temps d'attente trop long",
      "str_jusestautre": "disable",
      "int_jusordre": 1,
      "str_jusstatut": "enable"
    }
  ]
}
```
> `str_jusestautre = "enable"` pour le motif « Autre » → ouvre un champ texte libre côté client.

---

## 3. Enregistrement / mise à jour du vote — OBLIGATOIRE

```
POST /s2q/parametre-service/satisfaction/saveVote
Content-Type: application/json
```

**Body — Flow B « Sans ticket » (SERVICE_PRESTATION)**
```json
{
  "str_satvsource": "SERVICE_PRESTATION",
  "lg_socid": "13711124025984277964",
  "lg_ageid": "13711151844929304482",
  "lg_serid": "20261131553457634257",
  "lg_presid": "20261131554279597381",
  "lg_satisid": "20261015155721388446",
  "int_satisnote": 2,
  "int_npsnote": 8,
  "lg_jusid": "20261015155721389080",
  "str_satvautre": "Traitement un peu long",
  "str_nomcli": "",
  "str_prenomcli": "",
  "str_telcli": "",
  "str_emailcli": ""
}
```

**Règles métier importantes**
- `lg_socid` + `lg_ageid` : **obligatoires** pour le parcours SERVICE_PRESTATION (agence choisie par le client).
- `int_satisnote` : note cachée 1-5 de l'émoticône (CSAT) — toujours envoyée.
- `int_npsnote` : note de recommandation 0-10 (NPS) — étape séparée, optionnelle.
- `lg_jusid` : justificatif unique (optionnel).
- `str_satvautre` : texte libre (optionnel, max 150).
- **Mise à jour** : renvoyer `lg_satvid` (retourné à la création) → le backend met à jour au lieu de créer.
- Champs client optionnels : `str_nomcli`, `str_prenomcli`, `str_telcli`, `str_emailcli`.

**Réponse attendue (création)**
```json
{
  "reponse": "success",
  "message": "Vote enregistré avec succès !",
  "data": {
    "lg_satvid": "2026113..."
  }
}
```
> Codes d'erreur gérés côté front : `401` (session), `409` (déjà voté).

---

## 4. Images des émoticônes — OBLIGATOIRE (sinon les visages ne s'affichent pas)

```
GET /s2q/parametre-service/medias/getFile?filename=tres-insatisfait.png
```
> L'URL vient directement du champ `str_satisimg_url` retourné par l'endpoint n°1.
> **Ce endpoint de médias doit être public** (sans token) pour charger les images des émoticônes.

---

## 5. Services (uniquement si on garde le choix Service → Prestation côté web) — CONDITIONNEL

```
GET /s2q/parametre-service/service/listService?lg_socid=13711124025984277964
```

## 6. Prestations d'une agence (idem) — CONDITIONNEL

```
GET /s2q/parametre-service/agencePrestation/getPrestationsOfAgence?start=0&length=1000&lg_socid=13711124025984277964&lg_ageid=...&lg_serid=...
```

## 7. Contexte de vote sans ticket (idem) — CONDITIONNEL

```
GET /s2q/parametre-service/satisfaction/voteContext?lg_serid=...&lg_presid=...
```
> Retourne `service`, `prestation`, `deja_vote`, `avis` (émoticônes du groupe actif).

---

## ❌ À NE PAS exposer / non concernés (côté borne uniquement)

- `POST /borne-service/borne/connect` (appairage borne)
- `POST /borne-service/borne/session/open` (session borne)
- `GET /configuration-service/parametres/getParametre` (thème borne)
- `POST /admin-service/borne/{borneId}/disconnect`

---

## Récapitulatif pour le backend

| # | Priorité | Méthode + endpoint |
|---|---|---|
| 1 | 🔴 Obligatoire | `GET /parametre-service/satisfaction/listSatisfaction` |
| 2 | 🔴 Obligatoire | `GET /parametre-service/justificatif/listJustificatif` |
| 3 | 🔴 Obligatoire | `POST /parametre-service/satisfaction/saveVote` |
| 4 | 🔴 Obligatoire | `GET /parametre-service/medias/getFile` |
| 5 | 🟡 Conditionnel | `GET /parametre-service/service/listService` |
| 6 | 🟡 Conditionnel | `GET /parametre-service/agencePrestation/getPrestationsOfAgence` |
| 7 | 🟡 Conditionnel | `GET /parametre-service/satisfaction/voteContext` |

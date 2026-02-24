# praktilineylesanne2
Store Analytics ülesanded koos konsoolirakendusega kui ka veebirakendusega

## Ülesanne 1 (console-application branch)
Konsoolirakendus: prindib Store Analytics raporti.

Teie lahendus peab:
- olema TypeScriptis ja korrektselt tüübitud (interfaces/types);
- sisaldama vähemalt: tooted, tarnijad, laoseis ladude kaupa, arvustused, soodustuse reeglid;
- arvutama välja: saadav kogus (available), keskmine hinne, laoseisu staatus, soodushind;
- kuvama ka specifications (kui need on olemas), võtme-väärtuse paaridena;

## Ülesanne 2 (web-application branch)
Looge TypeScriptis interaktiivne veebirakendus, mis:
- kuvab toodete nimekirja,
- võimaldab lisada uusi tooteid,
- arvutab laoseisu staatuse,
- võimaldab filtreerida või sorteerida,
- salvestab andmed LocalStorage’i,
- taastab andmed pärast lehe värskendamist.
- looma elemendid dünaamiliselt (mitte kirjutama HTML-i käsitsi ette),

## Kuidas käivitada? (npm i, tsc, node dist/... või tsx vms).
1. Clone repository:
2. Ava kaust VS Code’is
3. Käivita Live Server või jooksuta selles kaustas npx http-server
4. Kasutades npx http-server leiate "Available on:" kuhu klikates avaneb brauseris lahendus.
   
## AI kasutamine
HTML failid said loodud ilma AI abita, TS failide puhul sai kasutatud Visual Studio Codes olemasolevat copiloti pluginat, mis aitas vajadusel ridu lisada. Kuna mul on olemas eelnev kogemus kutsekoolist veebiprogrammeerimisega, ei ole siin väga abi vaja. AI poolt sai abi küsitud ka erinevate commandide kohta - "On olemas index.html, main.ts ja dist/main.js failid, aga projekt ei avane veebis. Konsoolis on error Access to script at 'file:///C:/Users/johan/Kooli%20programmeerimine/Veebiprogrammeerimine/Praktiline-%C3%BClesanne-2_J%C3%B5erand/dist/main.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.Understand this error main.js:1 Failed to load resource: net::ERR_FAILED"


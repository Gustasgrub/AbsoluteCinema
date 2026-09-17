# AbsoluteCinema

**T120B165 Saityno taikomųjų programų projektavimas**

Studentas: Gustas Grubliauskas, IFF-3/9
Dėstytojai: Tomas Blažauskas

---

## 1. Sprendžiamo uždavinio aprašymas

### 1.1. Sistemos paskirtis

Projekto tikslas – sukurti kino ir serialų katalogo platformą **AbsoluteCinema**, kurioje naudotojai galėtų susipažinti su filmų studijų sukurtais filmais bei serialais, skaityti ir rašyti jų recenzijas, taip padedant kitiems naudotojams priimti sprendimą, kokį filmą žiūrėti.

Veikimo principas – kuriamą platformą sudaro dvi dalys: internetinė aplikacija, kuria naudosis paprasti lankytojai, registruoti nariai bei administratorius, ir aplikacijų programavimo sąsaja (API).

Sistemoje egzistuoja trys hierarchiškai susieti taikomosios srities objektai:

**Studija → Filmas → Recenzija**

Kiekviena studija turi daug jos sukurtų filmų, o kiekvienas filmas gali turėti daug naudotojų parašytų recenzijų.

Registruotas narys, norėdamas naudotis šia platforma, prisiregistruos prie internetinės aplikacijos ir galės naršyti studijų bei filmų katalogą, filtruoti filmus pagal studiją, žanrą ir išleidimo metus, o peržiūrėjęs filmą – parašyti jam recenziją su įvertinimu balais ir tekstiniu komentaru. Administratorius tvirtins naujas studijas ir filmus prieš jiems pasirodant viešame kataloge bei moderuos naudotojų paliktas recenzijas.

### 1.2. Funkciniai reikalavimai

**Neregistruotas sistemos naudotojas (svečias) galės:**
1. Peržiūrėti platformos reprezentacinį puslapį su studijų ir filmų sąrašu;
2. Peržiūrėti filmo informaciją bei apie jį paliktas recenzijas;
3. Prisijungti prie internetinės aplikacijos.

**Registruotas sistemos naudotojas (narys) galės:**
1. Atsijungti nuo internetinės aplikacijos;
2. Prisijungti (užsiregistruoti) prie platformos;
3. Naršyti studijų sąrašą ir peržiūrėti kiekvienai studijai priklausančius filmus;
4. Filtruoti bei puslapiuoti filmų sąrašą pagal studiją, žanrą ir išleidimo metus;
5. Parašyti recenziją pasirinktam filmui:
   1. Nurodyti filmo įvertinimą balais (pvz., nuo 1 iki 10);
   2. Pridėti tekstinį recenzijos aprašymą;
6. Redaguoti arba ištrinti savo parašytą recenziją;
7. Peržiūrėti kito naudotojo profilį ir jo parašytas recenzijas;
8. Peržiūrėti bendrą filmo įvertinimą, apskaičiuotą pagal visas jam parašytas recenzijas.

**Administratorius galės:**
1. Pridėti, redaguoti ir šalinti studijas;
2. Pridėti, redaguoti ir šalinti filmus, priskirdamas juos studijoms;
3. Šalinti netinkamo turinio arba nepagrįstas recenzijas;
4. Šalinti naudotojus.


**2.1 pav.** Sistemos AbsoluteCinema diegimo diagrama

Sistemos talpinimui yra naudojama **Railway** debesijos platforma. Kiekviena sistemos dalis (interneto aplikacija, API ir duomenų bazė) diegiama kaip atskira Railway paslauga, automatiškai perdiegiama iš GitHub saugyklos. Internetinė aplikacija pasiekiama per HTTP(S) protokolą. Sistemos veikimui (pvz., duomenų manipuliavimui su duomenų baze) reikalingas AbsoluteCinema API, kuris pasiekiamas per aplikacijų programavimo sąsają. Pats absoluteCinema API vykdo duomenų mainus su duomenų baze – tam naudojama ORM sąsaja.

## 2. Pasirinktų technologijų aprašymas

| Sluoksnis | Technologija | Pagrindimas |
|---|---|---|
| Kliento pusė (Front-End) | **React.js** | Komponentinė architektūra, didelė ekosistema (React Router, Axios), plati dokumentacija ir bendruomenė |
| Serverio pusė (Back-End) | **PHP Laravel** | Integruotas Eloquent ORM, paruošti autentifikacijos/autorizacijos įrankiai, greitas REST API kūrimas |
| Duomenų bazė | **MySQL** | Gerai palaikoma Laravel Eloquent ORM, tinka hierarchiniams vienas-su-daug ryšiams |
| Autentifikacija / autorizacija | **JWT** (access + refresh token) | Trumpai galiojantis access žetonas, ilgiau galiojantis refresh žetonas; žetone saugoma rolė ir ID |
| Diegimas | **Railway** | Automatinis diegimas iš GitHub, valdoma MySQL paslauga, nemokamas planas pakankamas demonstracijoms |

## 3. Rolės

| Rolė | Teisės |
|---|---|
| Svečias | Peržiūrėti studijas, filmus ir recenzijas |
| Narys | + rašyti/redaguoti/trinti savo recenzijas |
| Administratorius | + valdyti studijas, filmus, moderuoti recenzijas, šalinti naudotojus |

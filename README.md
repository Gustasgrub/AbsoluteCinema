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

---

## 4. Architektūra ir projekto struktūra

| Dalis | Technologija | Katalogas |
|---|---|---|
| Serverio pusė (API) | PHP 8.4 · Laravel 13 · JWT (firebase/php-jwt) · 2FA (google2fa) | [`backend/`](backend) |
| Duomenų bazė | MySQL 8 (lokaliai galima SQLite) | [`backend/database/`](backend/database) |
| Kliento pusė | React 19 · React Router · Vite · gryna CSS | [`frontend/`](frontend) |
| API specifikacija | OpenAPI 3.0 + Swagger UI (`/docs`) | [`backend/public/openapi.yaml`](backend/public/openapi.yaml) |
| Testai | Postman kolekcija (66 užklausos, 140 testų) · PHPUnit | [`postman/`](postman), [`backend/tests/`](backend/tests) |
| Diegimas | Docker · Railway (FrankenPHP + Caddy + MySQL) | `Dockerfile`, [`docker-compose.yml`](docker-compose.yml) |

```
 Naršyklė ──HTTPS──▶ frontend (Caddy: React failai + /api proxy) ──HTTP──▶ backend (FrankenPHP + Laravel API) ──ORM──▶ MySQL
```

---

## 5. Paleidimas lokaliai

### A variantas – be Docker (greičiausias)

Reikia: PHP 8.4+, Composer, Node.js 22+.

```bash
# Backend (API) – http://localhost:8000
cd backend
composer install
cp .env.example .env            # DB_CONNECTION=sqlite – jei nėra MySQL (arba nurodykite MySQL duomenis)
php artisan key:generate
php artisan jwt:secret          # sugeneruoja JWT_SECRET į .env
php artisan migrate:fresh --seed
php artisan serve

# Frontend – http://localhost:5173 (kitame terminale)
cd frontend
npm install
npm run dev
```

Naudojant SQLite: `.env` faile `DB_CONNECTION=sqlite`, o `DB_HOST/DB_DATABASE...` eilutes užkomentuokite.
Naudojant MySQL: sukurkite DB `absolutecinema` ir `.env` nurodykite `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`.

### B variantas – Docker (MySQL + API + frontend viena komanda)

```bash
docker compose up --build
```

- Svetainė: http://localhost:8080
- API: http://localhost:8000/api/v1 (Postman)
- API dokumentacija: http://localhost:8080/docs

### Demo paskyros

| Rolė | El. paštas | Slaptažodis |
|---|---|---|
| Administratorius | `admin@absolutecinema.test` | `Admin123!` |
| Narys | `member@absolutecinema.test` | `Member123!` |
| Kiti nariai (rasa, tomas, ieva, lukas, greta, mantas, emilija, dovydas) | `vardas@absolutecinema.test` | `Member123!` |

Pradiniai duomenys: 7 tikros studijos, 40 filmų/serialų, 10 naudotojų, 120 recenzijų
([`database/seeders/data/`](backend/database/seeders/data)).

---

## 6. API

Bazinis adresas: `/api/v1`. Visi atsakymai – JSON. Klaidos – RFC 9457 „Problem Details“ formatu:

```json
{ "type": "about:blank", "title": "Not Found", "status": 404, "detail": "Studio #99 was not found." }
```

| Metodas | Adresas | Kas gali | Sėkmė | Galimos klaidos |
|---|---|---|---|---|
| GET | `/studios` | visi | 200 | 400 |
| POST | `/studios` | admin | 201 | 400, 401, 403, 415, 422 |
| GET | `/studios/{studio}` | visi | 200 (304) | 404 |
| PUT / PATCH | `/studios/{studio}` | admin | 200 | 401, 403, 404, 422 |
| DELETE | `/studios/{studio}` | admin | 204 | 401, 403, 404 |
| GET | `/studios/{studio}/movies` | visi | 200 | 400, 404 |
| POST | `/studios/{studio}/movies` | admin | 201 | 401, 403, 404, 422 |
| GET | `/studios/{studio}/movies/{movie}` | visi | 200 | 404 |
| PUT / PATCH | `/studios/{studio}/movies/{movie}` | admin | 200 | 401, 403, 404, 422 |
| DELETE | `/studios/{studio}/movies/{movie}` | admin | 204 | 401, 403, 404 |
| GET | `/studios/{studio}/movies/{movie}/reviews` | visi | 200 | 400, 404 |
| POST | `/studios/{studio}/movies/{movie}/reviews` | narys, admin | 201 | 401, 404, **409**, 422 |
| GET | `/studios/{studio}/movies/{movie}/reviews/{review}` | visi | 200 | 404 |
| PUT / PATCH | `/studios/{studio}/movies/{movie}/reviews/{review}` | tik autorius | 200 | 401, 403, 404, 422 |
| DELETE | `/studios/{studio}/movies/{movie}/reviews/{review}` | autorius, admin | 204 | 401, 403, 404 |
| GET | `/movies` | visi | 200 | 400 |
| GET | `/dashboard` | visi | 200 | – |
| GET | `/users` | admin | 200 | 401, 403 |
| GET | `/users/{user}` | visi | 200 | 404 |
| PATCH | `/users/{user}` | pats naudotojas / admin | 200 | 401, 403, 404, 422 |
| DELETE | `/users/{user}` | admin (ne save) | 204 | 401, 403, 404 |
| GET | `/users/{user}/reviews` | visi | 200 | 400, 404 |
| POST | `/auth/register` | visi | 201 | 422, 429 |
| POST | `/auth/login` | visi | 200 | 401, 422, 429 |
| POST | `/auth/refresh` | turintys refresh slapuką | 200 | 401 |
| POST | `/auth/logout` | prisijungę | 204 | 401 |
| GET | `/auth/me` | prisijungę | 200 | 401 |
| POST / DELETE | `/auth/two-factor` | prisijungę | 200 / 204 | 401, 409, 422 |
| POST | `/auth/two-factor/confirm` | prisijungę | 200 | 401, 409, 422 |
| POST | `/auth/two-factor/challenge` | visi | 200 | 401, 422, 429 |

**Hierarchinis metodas per visus 3 objektus:** `GET /studios/1/movies/1/reviews`.
Jei filmas nepriklauso nurodytai studijai (`/studios/2/movies/1`) – **404** (apimties valdymas per URL).

**Puslapiavimas:** `?page=2&per_page=12` (max 50). Atsakyme `meta` (total, last_page…) ir `_links` (first, prev, next, last).
**Filtravimas ir rikiavimas:** `/movies?genre=sci-fi&type=movie&year_from=2000&year_to=2020&min_rating=8&studio_id=4&search=nolan&sort=-rating`,
`/studios?country=USA&founded_from=1980&sort=-movies`, `.../reviews?min_rating=7&spoilers=false&sort=-rating`.
**Hypermedia (HATEOAS):** kiekvienas resursas turi `_links`. Veiksmų nuorodos (`update`, `delete`, `create_review`…)
rodomos tik tada, kai dabartinis naudotojas tą veiksmą atlikti gali – frontend pagal jas sprendžia, kuriuos mygtukus rodyti.
**Resursai iš kelių esybių:** `GET /dashboard` (Studio + Movie + Review + User) ir `GET /users/{id}` profilis (User + Review + Movie + Studio).

### Statuso kodai

| Kodas | Kada |
|---|---|
| 200 / 201 / 204 | sėkmė / sukurta (+ `Location` antraštė) / ištrinta (be turinio) |
| 304 | `If-None-Match` sutampa su `ETag` – duomenys nepasikeitė |
| 400 | sugadintas JSON (`{"name": `) arba neteisingi query parametrai (`?page=abc`) |
| 401 | nėra žetono, jis suklastotas, pasibaigęs arba atšauktas; blogas slaptažodis |
| 403 | rolė ar savininkas neleidžia (narys kuria studiją, redaguoja svetimą recenziją) |
| 404 | resurso nėra arba jis nepriklauso tėviniam resursui URL'e; nežinomas adresas |
| 405 | netinkamas metodas (`POST /studios/1`), su `Allow` antrašte |
| 409 | antra recenzija tam pačiam filmui; 2FA jau įjungta |
| 415 | turinys siunčiamas ne JSON formatu |
| 422 | JSON geras, bet duomenys neteisingi (pvz. `rating: 11`) – su `errors` kiekvienam laukui |
| 429 | per daug prisijungimo bandymų (10 / min.) |

### OpenAPI

- Naršyklėje: `http://localhost:8000/docs` (Swagger UI)
- Failas: [`backend/public/openapi.yaml`](backend/public/openapi.yaml) – visi metodai su pavyzdžiais ir galimais atsakymais.

---

## 7. Autentifikacija ir autorizacija (JWT)

| | Access žetonas | Refresh žetonas |
|---|---|---|
| Kas tai | JWT (header.payload.signature) | atsitiktinė 64 simbolių eilutė |
| Galioja | 15 min. | 14 d. (kiekvieną kartą pratęsiama – rotacija) |
| Kur saugomas klientui | JavaScript atmintyje (ne localStorage) | `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth` slapuke |
| Kaip siunčiamas | `Authorization: Bearer <token>` | naršyklė prideda automatiškai |
| Kur saugomas serveryje | niekur (stateless), atsijungus – `jti` juodajame sąraše | DB lentelėje `refresh_tokens` – tik SHA-256 hash'as |

JWT turinys (claims): `iss`, `sub` (naudotojo ID), `role`, `name`, `typ`, `iat`, `exp`, `jti`. Pasirašoma **HS256** (HMAC-SHA256)
raktu `JWT_SECRET` iš `.env`. Pakeitus vieną payload simbolį parašas nebesutampa → 401.

- **Atnaujinimas:** gavęs 401, frontend kviečia `POST /auth/refresh`, gauna naują access žetoną ir pakartoja užklausą.
  Senas refresh žetonas atšaukiamas (rotacija); pakartotinai panaudojus seną – atšaukiamos visos naudotojo sesijos.
- **Atsijungimas:** refresh žetonas ištrinamas iš DB, access žetono `jti` įrašomas į juodąjį sąrašą, slapukas išvalomas.
- **Rolės:** svečias (neprisijungęs), narys (`member`), administratorius (`admin`). Rolė yra žetone; serveris ją sutikrina
  su DB – jei administratorius pakeitė rolę, senas žetonas nebegalioja.
- **Apsauga pagal ID:** recenziją redaguoti gali tik autorius, trinti – autorius arba administratorius.
- **2FA (papildomai):** TOTP kodai (Google/Microsoft Authenticator). Profilyje → „Set up 2FA“ → QR kodas.

---

## 8. Testavimas

```bash
# Visa Postman kolekcija (66 užklausos, 140 testų, ~9 s). Backend turi veikti :8000
npx newman run postman/AbsoluteCinema.postman_collection.json -e postman/AbsoluteCinema.local.postman_environment.json

# PHPUnit testai (atskira atminties DB)
cd backend && php artisan test
```

Postman'e: *Import* → abu failai iš [`postman/`](postman) → pasirinkti aplinką „AbsoluteCinema – local“ → kolekcija → **Run**.
Kolekcija sukuria savo testinius duomenis ir pabaigoje juos ištrina, todėl ją galima leisti daug kartų.
Aplankas *7. Error cases* parodo 400, 401, 403, 404, 405, 409, 415, 422 atvejus.

---

## 9. Naudotojo sąsaja

Ekrano nuotraukos (kompiuteris ir telefonas): [`docs/screenshots/`](docs/screenshots).

Dizaino idėja – **kino festivalio programėlė**: šiltas popierius, juodas „rašalas“, raudona uždanga ir gintarinės
švieslentės lemputės. Antraštė – kino juosta su perforacija, poraštė – pabaigos titrai ant uždangos,
recenzijos – kino bilietai, modaliniai langai – su klakete, profilis – festivalio akreditacija.
Filmų plakatai generuojami SVG pagal žanrą (arba rodomas `poster_url` paveikslėlis).

| Reikalavimas | Kur |
|---|---|
| CRUD visiems 3 objektams | Studijos – `StudiosPage`/`StudioPage`, filmai – `StudioPage`/`MoviePage`, recenzijos – `MoviePage` |
| Registracija, prisijungimas, žetonų atnaujinimas | `pages/LoginPage.jsx`, `pages/RegisterPage.jsx`, `api/client.js` (401 → refresh → kartojama) |
| ≥ 4 įvesties elementai | text, email, password, textarea, number, date, url, **color**, **range**, select, radio, checkbox, datalist |
| Paveikslėliai, prisitaikantys prie lango | `public/images/*` + `img { max-width: 100% }` (`styles/base.css`), SVG plakatai |
| Vektorinės ikonos meniu | [lucide-react](https://lucide.dev) (SVG), logotipas – `components/Logo.jsx` |
| Header / content / footer skirtingi | `styles/layout.css` (juodas header, popierinis turinys, raudonas footer) |
| Modaliniai langai | `components/Modal.jsx` (kūrimo, redagavimo, trynimo, 2FA formos) |
| Animacijos | visos `styles/animations.css` (puslapio perėjimas, lemputės, skaitliukai, klaketė, krovimas 3-2-1…) |
| Nestandartinis šriftas | Google Fonts `index.html` → kintamieji `styles/tokens.css` |
| Grįžtamasis ryšys be `alert()` | `components/Toast.jsx` |
| Lūžio taškas + hamburger | `@media (max-width: 768px)` – `styles/layout.css`, mygtukas – `components/layout/Header.jsx` |

---

## 10. Diegimas (Railway)

1. Įkelkite projektą į GitHub.
2. Railway → **New Project** → **Database → MySQL**.
3. **New → GitHub Repo** → šis repo → *Settings → Root Directory* `backend`, servisą pavadinkite `backend`. Kintamieji:
   ```
   APP_KEY=base64:...                 # php artisan key:generate --show
   JWT_SECRET=...                     # php artisan jwt:secret --show
   APP_URL=https://<frontend domenas>
   PORT=8080
   FORCE_HTTPS=true
   JWT_COOKIE_SECURE=true
   DB_CONNECTION=mysql
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   ```
   Pirmo paleidimo metu automatiškai sukuriamos lentelės ir įkeliami pradiniai duomenys.
4. **New → GitHub Repo** → tas pats repo → *Root Directory* `frontend`, servisas `frontend`. Kintamasis:
   ```
   API_UPSTREAM=http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:8080
   ```
5. `frontend` → *Settings → Networking → Generate Domain*. (Jei reikia API Postman'ui – domeną galima sugeneruoti ir `backend`.)

---

## 11. Kur ką rasti kode (gynimui)

**API (1 lab.)**
- Keliai: [`backend/routes/api.php`](backend/routes/api.php) – visi endpoint'ai ir kas juos gali kviesti.
- Logika: [`app/Http/Controllers/Api/`](backend/app/Http/Controllers/Api) · validacija: [`app/Http/Requests/`](backend/app/Http/Requests)
- Modeliai, ryšiai, filtrai: [`app/Models/`](backend/app/Models) · DB struktūra: [`database/migrations/`](backend/database/migrations)
- JSON forma ir `_links`: [`app/Http/Resources/`](backend/app/Http/Resources), [`app/Support/Link.php`](backend/app/Support/Link.php), [`app/Support/Paginated.php`](backend/app/Support/Paginated.php)
- Klaidos → statuso kodai: [`app/Support/ApiError.php`](backend/app/Support/ApiError.php) (prijungta [`bootstrap/app.php`](backend/bootstrap/app.php))
- 400 / 415: [`app/Http/Middleware/ValidateJsonBody.php`](backend/app/Http/Middleware/ValidateJsonBody.php) · ETag / 304: [`AddEtagHeader.php`](backend/app/Http/Middleware/AddEtagHeader.php)

**Naujo objekto su CRUD pridėjimas** (pvz. „Apdovanojimas“ filmui):
1. `php artisan make:model Award -m` → migracijoje laukai + `foreignId('movie_id')->constrained()->cascadeOnDelete()`
2. Modelyje `$fillable`, ryšys `Movie::awards()` (hasMany)
3. `php artisan make:request AwardRequest` → `rules()`
4. `php artisan make:resource AwardResource` → `toArray()` su `_links`
5. `php artisan make:controller Api/AwardController --api` → index/store/show/update/destroy (kaip `StudioMovieController`)
6. Keliai `routes/api.php`, pvz. `Route::post('movies/{movie}/awards', ...)->can('create', Award::class)`
7. `php artisan make:policy AwardPolicy --model=Award` → kas gali kurti/keisti
8. `php artisan migrate`

**Autentifikacija (2 lab.)**
- Žetono sukūrimas ir pasirašymas: [`app/Services/JwtService.php`](backend/app/Services/JwtService.php) → `createAccessToken()`
- Raktas ir galiojimo laikai: [`config/jwt.php`](backend/config/jwt.php), `.env` → `JWT_SECRET`
- Žetono tikrinimas kiekvienai užklausai: [`app/Http/Middleware/AuthenticateJwt.php`](backend/app/Http/Middleware/AuthenticateJwt.php)
- Refresh strategija ir slapuko vėliavėlės: [`app/Services/RefreshTokenService.php`](backend/app/Services/RefreshTokenService.php)
- Register / login / refresh / logout: [`app/Http/Controllers/Api/AuthController.php`](backend/app/Http/Controllers/Api/AuthController.php)
- Teisės pagal rolę ir ID: [`app/Policies/`](backend/app/Policies)
- Apsauga nuo grėsmių: SQL injekcijos – Eloquent parametrai (niekur nėra SQL eilučių sujungimo);
  teisių eskalacija – `role` nėra `$fillable`, `UserUpdateRequest` draudžia keisti rolę; slaptažodžių spėliojimas –
  užklausų limitas `AppServiceProvider`; XSS – React automatiškai „escape'ina“ tekstą, refresh žetonas `HttpOnly`;
  CSRF – `SameSite=Strict`; slaptažodžiai – bcrypt; 2FA raktas DB užšifruotas.

**Naudotojo sąsaja (3 lab.)**
- Struktūra: `src/pages` (puslapiai), `src/components` (pakartotinai naudojami), `src/hooks/useApi.js` (duomenų gavimas),
  `src/api/client.js` (vienintelė vieta, kur kviečiamas API), `src/auth/AuthContext.jsx` (prisijungusio naudotojo būsena).
- Būsena: `useState` komponentuose, `Context` (naudotojas, pranešimai), filtrai ir puslapis – URL'e (`useSearchParams`).

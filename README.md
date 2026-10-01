# Football 6 Manager

Application web de gestion d'une équipe de football à 6 joueurs.

## Stack

- Next.js Pages Router
- React JSX
- TailwindCSS
- MySQL avec mysql2
- Lucide React
- Recharts

## Installation Windows

### 1. Prérequis

Installer Node.js 18.18 ou supérieur et MySQL Server.

### 2. Base MySQL

Ouvrir MySQL puis exécuter :

```sql
SOURCE database/schema.sql;
```

Ou depuis le terminal :

```powershell
mysql -u root -p < database/schema.sql
```

Si votre compte root n'a pas de mot de passe, utilisez :

```powershell
mysql -u root < database/schema.sql
```

### 3. Variables d'environnement

Copier `.env.example` vers `.env.local` puis adapter les valeurs :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=football6_manager
```

### 4. Installation

```powershell
npm install
```

### 5. Développement

```powershell
npm run dev
```

Ouvrir :

http://localhost:3000

### 6. Production

```powershell
npm run build
npm run start
```

### 7. Tests

```powershell
npm run test
```

## Fonctionnalités

- Gestion des joueurs avec archivage
- Vérification des numéros de maillot actifs
- Création d'un match en cinq étapes
- Sélection exacte de six joueurs
- Positions RW, LW, ST, CM, LB, RB, CB et GK sans contrainte de formation
- Gestion des buts et passes décisives
- Validation serveur de la cohérence du score
- Instantané du nom, numéro et photo dans chaque participation historique
- Calcul déterministe des notes de 5.0 à 10.0 côté serveur
- Liste des matchs et filtres
- Statistiques calculées depuis MySQL
- Interface arabe RTL
- Design sombre rose/violet responsive

## Remarque sur les images

Les photos sont sélectionnées depuis le navigateur, converties en Base64 puis enregistrées directement dans MySQL.

## Moteur de notation

La note utilise les buts, leur contexte séquentiel, les passes décisives, le résultat collectif, l'écart du score et une composante liée au poste. Elle est bornée entre 5.0 et 10.0. Les données défensives non enregistrées ne sont pas inventées.

## Images

Les photos sont enregistrées directement dans MySQL sous forme Base64 dans les colonnes `players.image` et `match_players.image_snapshot`. Les fichiers sélectionnés sont limités à 2MB et les formats PNG, JPEG et WebP sont acceptés.

Si vous utilisez une ancienne base créée avec la première version, recréez les tables avec `database/schema.sql` afin d'obtenir les colonnes `LONGTEXT`.

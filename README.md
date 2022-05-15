# Project Marketplace

## Prérequis

- Ganache
- Truffle

## Installation du projet

A la racine du projet :

``~ cp .env-dist .env``

Renseigner les variables d'environnements

``~ truffle deploy``

## Lancement du projet

``~ npm install``

``~ npm run start``

## TODO

- [] Liste des NFT à la vente
- [] Liste des NFT possédés par l'utilisateur connecté
- [x] Création d'une collection
- [x] Ajouter un NFT à une collection

## Must to have
- [] Déploiement sur HEROKU

## Nice to have
- [-] Système de royalties
- [] Création de collection : Gestion des champs obligatoires
- [] Ajouter un loader : page de creation de collection
- [] Ajouter un loader : page de creation de NFT
- [] Utilisation de ERC1155
- [] Tri de NFT par collection
- [] Système d'enchère
- [] Token de protocole permettant l'achat

## To deploy with HEROKU

```shell
~ heroku create alyra-marketplace --buildpack mars/create-react-app
~ git subtree push --prefix client/ heroku master
```

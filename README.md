# Useful links
For the report: [https://www.overleaf.com/project/65bd73dcc38c121ef31c7242](https://www.overleaf.com/project/65bd73dcc38c121ef31c7242 "Report - Projet INF421")

For the slides: [https://www.overleaf.com/project/65bd742c3d4db158069e0511](https://www.overleaf.com/project/65bd742c3d4db158069e0511 "Slides - Projet INF421")


# Structure du projet
Le lecteur trouvera à la racine du projet les fichiers suivant : 
* ```README``` : le présent fichier.
* ```Rapport_INF421_BENDAHI_FRADIN.pdf``` : le rapport de notre projet.
* ```PI_INF421_BENDAHI_FRADIN.ipynb``` : le notebook Jupyter contenant tous les codes (algorithmes, générations de données et fonctions de tests).
* ```sujet.pdf``` : le sujet du problème.
* ```benchmark_0.txt.tar.gz```, ```benchmark_0_without_results.txt``` et ```benchmark_1.txt``` : les fichiers (l'un compressé, les autres non) contenant quelques test réalisé sur les jeux de données

ainsi que les répertoires suivants : 
* ```/datasets``` : contient tous les jeux de données.
* ```/web``` : contient l'application web qui anime les tâches 1, 2, 3, 5 et 6.

# Notebook Jupyter
Il contient l'intégralité de nos codes (hormis ceux de l'application web, situés dans le dossier ```/web```) Python, rangé en parties et sous-parties.

## Préliminaires
**Attention** : nous utilisons des convention de ```typing``` en Python afin de donner plus de sens aux arguments des fonctions et à certaines variables essentielles. Il est donc impératif d'exécuter les deux cellules de code situées dans ```Préliminaire/Imports```. notamment cette cellule-ci : 
```python
Point = list[float, ...]
Ensemble = list[Point]
Graphe = list[list[int]]
```
Nous n'utilisons pas de bibliothèques (hormis ```NumPy``` et ```matplotlib```) en dehors de la librairie standard. La bibliothèque ```signal``` nous sert lors de nos benchmarks à fixer un temps limite d'exécution pour une fonction sur une entrée.

## _Subsampling_ et _Neighborhood_
Ces deux parties reprennent le même découpage en sous-parties que le sujet, les fonctions intéressantes sont : ```task_1_queue```, ```task_2_queue```, ```task_3``` et ```task_4_finding_only``` qui prennent en entrée toutes et dans le même ordre : 
- ```P``` : une liste de points.
- ```p_1``` : un point de P.
- ```k``` : le nombre de centres à calculer.

ainsi que les fonctions : ```task_5```, ```task_6``` et ```task_7_benchmark``` (utilisé pour les test) qui prennent toutes comme unique argument ```P``` (un ensemble de points). La fonction ```task_7_benchmark``` repose sur la fonction de ```task_7``` afin de calculer le graphe des voisins de manière incrémentale.

## _Experiments_
Cette partie contient intégralement tous nos codes pour charger, générer et sauvegarder des jeux de données ainsi que lancer nos test. Il y a plusieurs sous-parties : 

### Datasets manipulation
Cette section contient les fonctions ```save_dataset``` et ```load_dataset```.

### Datasets generation
Cette section contient l'ensemble des fonctions pour générer des jeux de données. Il y a trois sous-sections où certains exemples sont affichés.

### Benchmarking
C'est la partie contenant les fonctions essentielles pour les tests, notamment ```generate_datasets``` qui est utilisé dans la première sous-section ```3.3.1 - Creating the datasets for benchmarking``` ainsi que dans la cellule suivante pour générer quelques jeux de données variés.

La sous-section suivante (```3.3.2```) contient la fonction ```benchmark``` qui est utilisé dans la sous-section ```3.3.3``` lors de l'exécution des tests. Par défaut, cette fonction enregistre les résultats des tests dans un fichier (typiquement ```benchmark_1.txt```), la première ligne est l'entête : 
> function_name, n, k, dataset_name, average_time, result

suivit, une ligne sur deux, des tests effectués, par exemple, une ligne typique (la valeur de ```k``` vaut ```None``` car elle n'est pas utilisée dans les tâches 5, 6 et 7) : 
> task_5, 18, None, 2_18_0.txt, 0.005069255828857422, [[3, 8, 15], [10], [8], [0, 17], [10, 13], [7, 14, 15], [9, 13], [5, 8], [0, 2, 7], [6, 15], [1, 4], [12, 13], [11, 16], [4, 6, 11], [5], [0, 5, 9], [12, 17], [3, 16]]

## Tester 
Pour tester nos codes, plusieurs possibilités, ou bien se référer à la sous-partie ```3.3.3 - Executing the tests...``` et exécuter les différentes cellules (la première va lire les jeux de donnée) et les deux autres cellules vont venir lancer les tests. Ou bien, charger un jeu de données et exécuter directement l'une des fonctions des parties précédentes (tâches 1, 2, 3, 4, 5, 6 ou 7) ou bien créer un jeu de donnée et tester directement dessus.

Le plus simple reste de générer et sauvegarder des jeux de données puis de les visualiser dans l'application web, voir comment ils sont, ajouter et / ou retirer des points si besoins puis d'enregistrer le jeu de données (**attention** à la convention de nommage !).

# Application web
**Attention** : nous n'excluons pas la présence de bugs, bien que les algorithmes ai été portés depuis ```Python``` vers ```JavaScript``` et que cela a grandement contribué à prévenir certains bugs algorithmique, il peut encore se glisser des bugs au niveau des couleurs affichées et au niveau du panneau de contrôle.

## Le panneau de contrôle
Il est à gauche de l'écran, en haut se trouve trois boutons : 
* ```Nettoyer``` : efface tous le canvas et réinitialise la scène.
* ```Charger``` : charger un jeu de donnée (il sera ajouté au canvas, donc en plus des points déjà présents).
* ```Enregistrer``` : sauvegarder le jeu de donnée à l'écran.

Juste en dessous se trouve une liste à puce avec les différents algorithmes disponibles suivit du bouton ```Lancer``` qui exécute l'algorithme sélectionné.

En dessous se trouve les paramètres pris en compte lors de la tâche, il y a : 
- des cases à cocher :
   - ```Afficher points dans S``` : affiche ou non (en rouge) les centres calculés.
   - ```Afficher rayons``` : affiche (en gris clair) un rayon entre deux sommets afin de mettre en évidence la distance en cours qui est regardée (s'il s'agit de comparaisons) ou calculée par l'algorithme.
   - ```Afficher point courant``` : colorie en jaune / orange le point actuellement _regardé_ par l'algorithme.
   - ```Afficher cercles``` : affiche les régions (des cercles) en gris (cf. tâche 3).
   - ```Afficher graphe``` : affiche les arêtes du graphe des voisins au fur et à mesure (cf. tâches 5 et 6).
- des sélecteurs :
   - ```k``` : fixe la valeur de l'entier k pour les tâches 1 à 3.
   - ```Temps d'attente entre 2 centres``` : le temps d'attente (en secondes) entre le calcul de deux centres (à ajouter au temps de calcul de l'algorithme).
   - ```Temps d'attente entre 2 rayons``` : le temps d'attente (en seconde) entre deux opérations _élémentaires_ i.e. une comparaison ou un calcul d'un ou plusieurs distances.

**Attention** : lorsqu'on clique sur le bouton ```Lancer```, il n'y a plus de retour en arrière possible, il faut soit attendre la fin de l'algorithme, soit recharger (```F5```) la page !

## Le canvas
Situé à droite de l'écran, le canvas est la zone de dessin. Les contrôles suivants sont disponibles :
* ```clique gauche``` (souris) : ajouter un point (le point rouge est le premier centre).
* ```clique droit``` (souris) : retirer un point.
* ```molette``` (souris) : le zoom (+/-).
* ```barre espace``` + ```bouton gauche/droit``` (souris) : se déplacer sur le canvas (le curseur doit changer de forme).
* ```barre espace``` + ```double clique gauche/droit``` (souris) sur un point noir : désigner le point sur lequel on a fait la manipulation comme nouveau premier centre (il doit devenir rouge).

Pendant l'exécution d'un algorithme, il n'est pas possible de rajouter de nouveau point, **seul** le zoom est autorisé.

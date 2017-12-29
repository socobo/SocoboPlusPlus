#!/bin/bash

if [ "$1" = "-d" ]
then

  mongoimport --db socobo_dev --collection socobouser --drop --file ./data/create-socobouser.json --jsonArray
  mongoimport --db socobo_dev --collection recipe --drop --file ./data/create-recipe.json --jsonArray
  mongoimport --db socobo_dev --collection recipeCategory --drop --file ./data/create-recipe-categories.json  --jsonArray
  mongoimport --db socobo_dev --collection recipeIngredient --drop --file ./dev/create-recipe-ingredients.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemtemplate --drop --file ./data/create-fooditemtemplate.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemcategory --drop --file ./data/create-fooditemcategory.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemunit --drop --file ./data/create-fooditemunit.json --jsonArray
  mongoimport --db socobo_dev --collection fooditem --drop --file ./data/create-fooditem.json --jsonArray

elif [ "$1" = "-t" ]
then

  mongoimport --db socobo_test --collection socobouser --drop --file ./data/create-socobouser.json --jsonArray
  mongoimport --db socobo_test --collection recipe --drop --file ./data/create-recipe.json --jsonArray
  mongoimport --db socobo_test --collection recipeCategory --drop --file ./data/create-recipe-categories.json  --jsonArray
  mongoimport --db socobo_test --collection recipeIngredient --drop --file ../dev/create-recipe-ingredients.json --jsonArray
  mongoimport --db socobo_test --collection fooditemtemplate --drop --file ./data/create-fooditemtemplate.json --jsonArray
  mongoimport --db socobo_test --collection fooditemcategory --drop --file ./data/create-fooditemcategory.json --jsonArray
  mongoimport --db socobo_test --collection fooditemunit --drop --file ./data/create-fooditemunit.json --jsonArray
  mongoimport --db socobo_test --collection fooditem --drop --file ./data/create-fooditem.json --jsonArray

fi

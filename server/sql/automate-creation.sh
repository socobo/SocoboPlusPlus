#!/bin/bash

if [ "$1" = "-d" ]
then

  mongoimport --db socobo_dev --collection socobouser --drop --file ./data/create-socobouser.json --jsonArray
  mongoimport --db socobo_dev --collection recipes --drop --file ./data/create-recipe.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeCategory --drop --file ./dev/create-recipeCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeIngredient --drop --file ./dev/create-recipeIngredient.json
  mongoimport --db socobo_dev --collection fooditemtemplate --drop --file ./data/create-fooditemtemplate.json --jsonArray
  mongoimport --db socobo_dev --collection fooditem --drop --file ./data/create-fooditem.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemcategory --drop --file ./data/create-fooditemcategory.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemunit --drop --file ./data/create-fooditemunit.json --jsonArray

elif [ "$1" = "-t" ]
then

  mongoimport --db socobo_test --collection socobouser --drop --file ./data/create-socobouser.json --jsonArray
  mongoimport --db socobo_test --collection recipes --drop --file ./data/create-recipe.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection recipeCategory --drop --file ./test/create-recipeCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection recipeIngredient --drop --file ./test/create-recipeIngredient.json
  mongoimport --db socobo_test --collection fooditemtemplate --drop --file ./data/create-fooditemtemplate.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItem --drop --file ./test/create-foodItem.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItemCategory --drop --file ./test/create-foodItemCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItemUnit --drop --file ./test/create-foodItemUnit.json

fi

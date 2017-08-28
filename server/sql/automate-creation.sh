#!/bin/bash

if [ "$1" = "-d" ]
then

  mongoimport --db socobo_dev --collection socobousers --drop --file ./dev/create-socobousers.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipe --drop --file ./dev/create-recipe.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeCategory --drop --file ./dev/create-recipeCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeIngredient --drop --file ./dev/create-recipeIngredient.json
  mongoimport --db socobo_dev --collection fooditemtemplate --drop --file ./dev/create-foodItemTemplate.json --jsonArray
  mongoimport --db socobo_dev --collection fooditem --drop --file ./dev/create-foodItem.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemcategory --drop --file ./dev/create-foodItemCategory.json --jsonArray
  mongoimport --db socobo_dev --collection fooditemunit --drop --file ./dev/create-foodItemUnit.json --jsonArray

elif [ "$1" = "-t" ]
then

  mongoimport --db socobo_test --collection socobousers --drop --file ./test/create-socoboUser.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection recipe --drop --file ./test/create-recipe.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection recipeCategory --drop --file ./test/create-recipeCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection recipeIngredient --drop --file ./test/create-recipeIngredient.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItemTemplate --drop --file ./test/create-foodItemTemplate.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItem --drop --file ./test/create-foodItem.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItemCategory --drop --file ./test/create-foodItemCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_test --collection foodItemUnit --drop --file ./test/create-foodItemUnit.json

fi

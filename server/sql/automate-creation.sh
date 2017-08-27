#!/bin/bash

if [ "$1" = "-d" ]
then

  mongoimport --db socobo_dev --collection socobousers --drop --file ./dev/create-socoboUser.json --jsonArray
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipe --drop --file ./dev/create-recipe.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeCategory --drop --file ./dev/create-recipeCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection recipeIngredient --drop --file ./dev/create-recipeIngredient.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection foodItemTemplate --drop --file ./dev/create-foodItemTemplate.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection foodItem --drop --file ./dev/create-foodItem.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection foodItemCategory --drop --file ./dev/create-foodItemCategory.json
  # TODO: Add Demo Data: mongoimport --db socobo_dev --collection foodItemUnit --drop --file ./dev/create-foodItemUnit.json

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

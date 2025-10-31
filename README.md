# ![logo](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/src/Components/NavBar/SnapAndMixLogo.png)

Snap 'n' Mix is a web application that allows it's users to scan drink ingredients in their possession to recieve the best possible recipes for cocktails/mixes to make! In addition, they can save, browse and even upload their own recipes in a sleek, responsive UI. The site can be accessed [here.](https://snapnmix.net/)

Snap 'n' Mix was completely built with React for the front-end, NodeJS for the back-end and utilizes Google's Cloud Vision AI to make the scan feature possible!

This application was developed by Jaydan Zabar, Taimoor Salam, Dusan Sasic, Devin Caron and Cole Spehar

## Home page
![HomePage](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/public/HomePage.png)

## Cocktail modal
![Modals](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/public/ModalShowcase.png)

## Scan page
![Scan](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/public/ScanPage.png)

Allows the user to choose either uploading an image or using their camera to take a picture that is then sent to Google's Cloud Vision API for image classification.

## Scan result / Ingredients page
![Ingredients](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/public/Ingredients%20Scan.png)

Identified ingredients by Google's Cloud Vision API will be displayed here while also allowing the user to then add or remove ingredients.

## Best Matched Cocktail Recipes Page
![BestMatched](https://github.com/Taimoor-Salam/snapnmix/blob/main/frontend/public/BestMatchedCocktails.png)

Once ingredients are submitted and used to query an open-source cocktail database, cocktails that contain all or most of the ingredients will be returned and displayed on this page along with cocktails that contain one of the submitted ingredients.

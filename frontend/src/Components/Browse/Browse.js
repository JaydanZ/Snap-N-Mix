import "./Browse.css";
import Loading from "../Scan/Loading";
import CocktailCircleCard from "../Cards/CocktailCircleCard";
import CategoryCircleCard from "../Cards/CategoryCircleCard";
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import NavBar2 from "../NavBar/NavBar2";
import useDebounce from "../../Hooks/useDebounce";

const startUrl = process.env.REACT_APP_BACKEND_URL;

let RECIPE_DATA_POPULAR = [];
let FAV_IDS = [];
let NO_FAVORITES = [
  {
    alterClick: 2,
    strDrink: "Add favorites!",
    strDrinkThumb: "nofavorite.jpg",
  },
];
let NO_FAVORITES_GUEST = [
  {
    alterClick: 1,
    strDrink: "Sign up to track favourites!",
    strDrinkThumb: "nofavorite.jpg",
  },
];
let RECIPE_DATA = [];
let OPEN_CATEGORY = false;

const Browse = (props) => {
  // STATE
  const [displayedPopularData, setDisplayedPopularData] = useState([]);
  const [displayedLatestData, setDisplayedLatestData] = useState([]);
  const [displayedFavoriteData, setDisplayedFavoriteData] = useState([]);
  const [displayedSearchData, setDisplayedSearchData] = useState([]);
  const [displayedCategoryData, setDisplayedCategoryData] = useState([]);
  const [displayedCategoryBackButton, setDisplayedCategoryBackButton] =
    useState("");
  const [displayDetails, setDisplayDetails] = useState(null);
  const [cocktailSearchValue, setCocktailSearchValue] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // HOOKS
  const debouncedSearchValue = useDebounce(cocktailSearchValue, 1000);
  const { isLoggedIn, token, favs } = useContext(AuthContext);

  const { navBar } = props;

  const getDrinks = (category, func) => {
    try {
      axios
        .get(startUrl + "api/cocktails/" + category)
        .then((res) => {
          if (res.data.drinks != null) {
            RECIPE_DATA_POPULAR = res.data.drinks;
            if (category === "categories") {
              RECIPE_DATA_POPULAR = RECIPE_DATA_POPULAR.filter((catg) => {
                let filteredCategory;
                if (!catg.strCategory.includes("/")) {
                  filteredCategory = catg;
                }
                return filteredCategory;
              });
            }

            func(RECIPE_DATA_POPULAR);

            if (category === "categories") {
              setIsLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("fail");
    }
  };

  const getFavoriteDrinks = useCallback(
    (isLoggedIn) => {
      if (isLoggedIn !== false) {
        try {
          axios
            .get(startUrl + "api/cocktails/favorites/", {
              headers: { "auth-token": token },
            })
            .then((res) => {
              if (res.data.favRecipes === undefined) {
                setDisplayedFavoriteData(NO_FAVORITES);
              } else if (res.data.success === false) {
                setDisplayedFavoriteData(NO_FAVORITES);
              } else {
                if (res.data.favRecipes.favRecipes.length > 0) {
                  RECIPE_DATA_POPULAR = res.data.favRecipes.favRecipes;

                  FAV_IDS = RECIPE_DATA_POPULAR.map((drink) => {
                    return drink.idDrink;
                  });
                  favs(FAV_IDS);
                  setDisplayedFavoriteData(res.data.favRecipes.favRecipes);
                } else {
                  setDisplayedFavoriteData(NO_FAVORITES);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log("fail");
        }
      } else {
        setDisplayedFavoriteData(NO_FAVORITES_GUEST);
      }
    },
    [favs, token]
  );

  const updateFavoritesHandler = useCallback(() => {
    getFavoriteDrinks(true);
  }, [getFavoriteDrinks]);

  useEffect(() => {
    setIsLoading(true);
    OPEN_CATEGORY = false;
    navBar(<NavBar2 />);
    getFavoriteDrinks(isLoggedIn);
    getDrinks("popular", setDisplayedPopularData);
    getDrinks("latest", setDisplayedLatestData);
    getDrinks("categories", setDisplayedCategoryData);
  }, [navBar, isLoggedIn, getFavoriteDrinks]);

  const searchCocktail = (name) => {
    try {
      axios
        .get(startUrl + "api/cocktails/search/" + name)
        .then((res) => {
          if (res.data.drinks != null) {
            RECIPE_DATA = res.data.drinks;
            setDisplayedSearchData(RECIPE_DATA);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error("fail");
    }
  };

  // const cocktailSearchHandler = useCallback(
  //   (event) => {
  //     let cocktailEntered = "";
  //     console.log(event.target.value);

  //     if (event.target.value.length > 0) {
  //       cocktailEntered = event.target.value.trim();
  //       cocktailEntered = cocktailEntered.replace(" ", "+");
  //       searchCocktail(cocktailEntered);
  //       setCocktailSearch(
  //         <ul className="cocktailSearchList">
  //           {displayedSearchData.map((drink) => (
  //             <CocktailCircleCard
  //               type="drink"
  //               id={drink.idDrink}
  //               title={drink.strDrink}
  //               avatar={drink.strDrinkThumb}
  //               ingredients={ingredientsHandler(drink)}
  //               instructions={drink.strInstructions}
  //               clickHandler={cardClickHandler}
  //               updateFavorites={updateFavoritesHandler}
  //               favoriteIDs={FAV_IDS}
  //             />
  //           ))}
  //         </ul>
  //       );
  //     } else {
  //       setCocktailSearch();
  //     }
  //   },
  //   [updateFavoritesHandler]
  // );

  useEffect(() => {
    if (debouncedSearchValue && debouncedSearchValue.length > 0) {
      //cocktailSearchHandler(debouncedSearchValue);
      const cocktailEntered = debouncedSearchValue.trim().replace(" ", "+");
      searchCocktail(cocktailEntered);
    }
  }, [debouncedSearchValue]);

  const ingredientsHandler = (drink) => {
    let ingredients = [];
    let measurements = [];
    let completeTags = [];

    for (const property in drink) {
      if (property.includes("strIngredient")) {
        if (drink[property] !== null && drink[property] !== "") {
          ingredients.push(drink[property]);
        }
      }

      if (property.includes("strMeasure")) {
        if (drink[property] !== "") {
          measurements.push(drink[property]);
        }
      }
    }

    for (let i = 0; i < ingredients.length; i++) {
      if (measurements[i] === null) {
        completeTags.push(ingredients[i]);
      } else {
        completeTags.push(
          ingredients[i] + " (" + measurements[i].trim() + ") "
        );
      }
    }

    return completeTags;
  };

  const cardClickHandler = (state) => {
    setDisplayDetails(state);
  };

  const categoryClickHandler = (category) => {
    if (OPEN_CATEGORY === false) {
      try {
        axios
          .get(startUrl + "api/cocktails/categories/" + category)
          .then((res) => {
            let categoryArray = res.data.drinks;
            setDisplayedCategoryBackButton(
              <CocktailCircleCard
                type="category"
                title="Go Back"
                avatar="nofavorite.jpg"
                clickHandler={categoryClickHandler}
              />
            );
            setDisplayedCategoryData(categoryArray);
            let catList = document.querySelector(".cocktailCategoryList");
            catList.scrollLeft = 0;
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("fail");
      }
      OPEN_CATEGORY = true;
    } else {
      getDrinks("categories", setDisplayedCategoryData);
      setDisplayedCategoryBackButton();
      OPEN_CATEGORY = false;
    }
  };

  const arrowListScrollHandler = (direction, list) => {
    let catList = document.querySelector("." + list);

    if (direction === 0) {
      catList.scrollLeft = catList.scrollLeft - 300;
    } else {
      catList.scrollLeft = catList.scrollLeft + 300;
    }
  };

  return (
    <div className="communityContainer">
      {displayDetails}
      {isLoading && <Loading />}
      {!isLoading && (
        <ul className="cocktailAllLists">
          <div className="search-box">
            <button class="btn-search">
              <i class="fas fa-search"></i>
            </button>
            <input
              type="text"
              class="input-search"
              placeholder="Search for a cocktail.."
              aria-label="Search for a cocktail.."
              aria-describedby="button-addon2"
              onChange={(e) => setCocktailSearchValue(e.target.value)}
            ></input>
          </div>
          {displayedSearchData && (
            <ul className="cocktailSearchList">
              {displayedSearchData.map((drink) => (
                <CocktailCircleCard
                  type="drink"
                  id={drink.idDrink}
                  title={drink.strDrink}
                  avatar={drink.strDrinkThumb}
                  ingredients={ingredientsHandler(drink)}
                  instructions={drink.strInstructions}
                  clickHandler={cardClickHandler}
                  updateFavorites={updateFavoritesHandler}
                  favoriteIDs={FAV_IDS}
                />
              ))}
            </ul>
          )}
          <div className="listDiv">
            {OPEN_CATEGORY && (
              <button
                className="arrowListLeftScroll"
                onClick={() =>
                  arrowListScrollHandler(0, "cocktailCategoryList")
                }
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>
            )}
            <ul className="cocktailCategoryList">
              {displayedCategoryBackButton}
              {displayedCategoryData.map((category) => {
                if (OPEN_CATEGORY === false) {
                  return (
                    <CategoryCircleCard
                      type="category"
                      title={category.strCategory}
                      avatar={category.strCategory + ".jpg"}
                      clickHandler={categoryClickHandler}
                    />
                  );
                } else {
                  return (
                    <CocktailCircleCard
                      type="drink"
                      id={category.idDrink}
                      title={category.strDrink}
                      avatar={category.strDrinkThumb}
                      ingredients={ingredientsHandler(category)}
                      instructions={category.strInstructions}
                      clickHandler={cardClickHandler}
                      updateFavorites={updateFavoritesHandler}
                      favoriteIDs={FAV_IDS}
                    />
                  );
                }
              })}
            </ul>
            {OPEN_CATEGORY && (
              <button
                className="arrowListRightScroll"
                onClick={() =>
                  arrowListScrollHandler(1, "cocktailCategoryList")
                }
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            )}
          </div>
          <h5 className="listHeader">Popular Drinks</h5>
          <div className="listDiv">
            <ul className="cocktailPopularList">
              {
                <button
                  className="arrowListLeftScroll"
                  onClick={() =>
                    arrowListScrollHandler(0, "cocktailPopularList")
                  }
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
              }
              {displayedPopularData.map((drink) => (
                <CocktailCircleCard
                  type="drink"
                  id={drink.idDrink}
                  title={drink.strDrink}
                  avatar={drink.strDrinkThumb}
                  ingredients={ingredientsHandler(drink)}
                  instructions={drink.strInstructions}
                  clickHandler={cardClickHandler}
                  updateFavorites={updateFavoritesHandler}
                  favoriteIDs={FAV_IDS}
                />
              ))}
            </ul>
            {
              <button
                className="arrowListRightScroll"
                onClick={() => arrowListScrollHandler(1, "cocktailPopularList")}
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            }
          </div>
          <h5 className="listHeader">Latest Drinks</h5>
          <div className="listDiv">
            {
              <button
                className="arrowListLeftScroll"
                onClick={() => arrowListScrollHandler(0, "cocktailLatestList")}
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>
            }
            <ul className="cocktailLatestList">
              {displayedLatestData.map((drink) => (
                <CocktailCircleCard
                  type="drink"
                  id={drink.idDrink}
                  title={drink.strDrink}
                  avatar={drink.strDrinkThumb}
                  ingredients={ingredientsHandler(drink)}
                  instructions={drink.strInstructions}
                  clickHandler={cardClickHandler}
                  updateFavorites={updateFavoritesHandler}
                  favoriteIDs={FAV_IDS}
                />
              ))}
            </ul>
            {
              <button
                className="arrowListRightScroll"
                onClick={() => arrowListScrollHandler(1, "cocktailLatestList")}
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            }
          </div>
          <h5 className="listHeader">Favorite Drinks</h5>
          <div className="listDiv">
            {isLoggedIn && (
              <button
                className="arrowListLeftScroll"
                onClick={() =>
                  arrowListScrollHandler(0, "cocktailFavouriteList")
                }
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>
            )}
            <ul className="cocktailFavouriteList">
              {displayedFavoriteData.map((drink) => (
                <CocktailCircleCard
                  type={
                    drink.alterClick === 1
                      ? "signupDrink"
                      : drink.alterClick === 2
                      ? ""
                      : "drink"
                  }
                  id={drink.idDrink}
                  title={drink.strDrink}
                  avatar={drink.strDrinkThumb}
                  ingredients={ingredientsHandler(drink)}
                  instructions={drink.strInstructions}
                  clickHandler={cardClickHandler}
                  updateFavorites={updateFavoritesHandler}
                  favoriteIDs={FAV_IDS}
                />
              ))}
            </ul>
            {isLoggedIn && (
              <button
                className="arrowListRightScroll"
                onClick={() =>
                  arrowListScrollHandler(1, "cocktailFavouriteList")
                }
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            )}
          </div>
        </ul>
      )}
    </div>
  );
};

export default Browse;

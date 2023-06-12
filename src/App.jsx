import "./App.css";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
// Components
import Category from "./components/Category";
import Cart from "./components/Cart";

const calculateTotal = (cart) => {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].quantity * cart[i].price;
  }
  return total;
};

function App() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState("white");

  console.info("App");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.info("Fetching...");
        const response = await axios.get(
          "https://site--deliveroo-backend--5ytnmfswy69s.code.run/"
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = useCallback((meal) => {
    // const cartCopy = [...cart];
    // const mealPresent = cartCopy.find((elem) => elem.id === meal.id);
    // if (mealPresent) mealPresent.quantity++;
    // else cartCopy.push({ ...meal, quantity: 1 });
    // setCart(cartCopy);
    console.info("addToCart");
    setCart((cart) => {
      const mealPresent = cart.find((elem) => elem.id === meal.id);
      if (mealPresent) mealPresent.quantity++;
      else cart.push({ ...meal, quantity: 1 });
      return cart;
    });
  }, []);

  const handleRemoveFromCart = useCallback((meal) => {
    // const cartCopy = [...cart];
    // const mealPresent = cartCopy.find((elem) => elem.id === meal.id);
    // if (mealPresent.quantity === 1) {
    //   const index = cartCopy.indexOf(mealPresent);
    //   cartCopy.splice(index, 1);
    // } else {
    //   mealPresent.quantity--;
    // }
    // setCart(cartCopy);
    setCart((cart) => {
      const mealPresent = cart.find((elem) => elem.id === meal.id);
      if (mealPresent.quantity === 1) {
        const index = cart.indexOf(mealPresent);
        cart.splice(index, 1);
      } else {
        mealPresent.quantity--;
      }
      return cart;
    });
  }, []);

  let total = useMemo(() => {
    console.info("Calculating total");
    return calculateTotal(cart);
  }, [cart]);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className={`App ${theme === "white" ? "theme-white" : "theme-red"}`}>
      <div className="container hero">
        <div>
          <h1>{data.restaurant.name}</h1>
          <p>{data.restaurant.description}</p>
        </div>
        <img src={data.restaurant.picture} alt="" />
        <button
          className="theme-button"
          onClick={() => {
            setTheme((prev) => (prev === "white" ? "red" : "white"));
          }}
        >
          Switch theme
        </button>
      </div>
      <div className="content">
        <div className="container sections-container">
          <section className="left-section">
            {data.categories.map((category, index) => {
              if (category.meals.length !== 0) {
                return (
                  <Category
                    key={index}
                    category={category}
                    handleAddToCart={handleAddToCart}
                  />
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="right-section">
            <Cart
              cart={cart}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddToCart={handleAddToCart}
              total={total}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

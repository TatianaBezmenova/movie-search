import "regenerator-runtime/runtime";
import App from "./components/App";
import Movie from "./components/Movie";
import Login from "./components/Login";

(async() => {
    await App.render();
    Movie.eventListener();
    Login.eventListenerLogin(document.getElementById("btnLogin"));
})();
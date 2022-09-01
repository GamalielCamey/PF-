import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import flights from "../Reducers/flights";



const reducer = combineReducers({
    flights
});

export const store = createStore(
    reducer, 
    composeWithDevTools(applyMiddleware(thunk))
)
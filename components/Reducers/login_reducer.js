import { ADD_LOGIN } from "../Actions/types";

const loginState = {
    user: []
}

const loginReducer = (state = loginState, action) => {
    switch (action.type) {
        case "loginData":
            return({
                user: action.data
            })
        default:
            return state;
    }
}

export default loginReducer;
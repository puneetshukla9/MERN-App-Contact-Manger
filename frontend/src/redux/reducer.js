import { intialState } from "../common/config";

const manageContactsReducer = (state = intialState, action) => {
    switch (action.type) {
        case "CREATE":
            return {
                ...state,
                contactsData: [...state.contactsData, action.payload]

            }
        case "UPDATE":
            return {
                ...state,
                contactsData: action.payload

            }
        case "UPDATE_TOKEN":
            return {
                ...state,
                accessToken: action.payload

            }
        default:
            return state
    }

}
export default manageContactsReducer
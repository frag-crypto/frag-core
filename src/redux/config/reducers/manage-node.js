export const addNode = (state, action) => {
    return {
        ...state,
        user: {
            ...state.user,
            knownNodes: [
                ...state.knownNodes,
                action.payload
            ]
        }
    }
}

export const setNode = (state, action) => {
    return {
        ...state,
        user: {
            ...state.user,
            node: action.payload
        }
    }
}

import { SET_AREA, SET_AREA_LIST } from '../actions/areaActions.js'

export const areaReducer = (state, action) => {
    let handleSetArea = val => {
        return Object.assign({}, state, {
            area: action.area
        })
    }
    let handleSetAreaList = () => {
        return Object.assign({}, state, {
            areaList: action.areaList
        })
    }
    switch (action.type) {
        case SET_AREA:
            return Object.assign({}, state, {
                area: action.area
            })
        case SET_AREA_LIST:
            console.log('action22', action)
            return Object.assign({}, state, {
                areaList: action.areaList
            })
        default:
            return state
    }
}

//归属地点管理
const SET_AREA = 'SET_AREA'
const SET_AREA_LIST = 'SET_AREA_LIST'

const setArea = area => {
    console.log('areaaction', area)
    return {
        type: SET_AREA,
        area
    }
}

const setAreaList = areaList => {
    return {
        type: SET_AREA_LIST,
        areaList
    }
}

export { SET_AREA, setArea, SET_AREA_LIST, setAreaList }

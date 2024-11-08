import React, { Component, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toUpperCase } from '../../tools/host'

const HeaderC = props => {
    const userInfo = Cookies.get('crm_user_info') ? JSON.parse(Cookies.get('crm_user_info')) : {}
    const checkCh = str => {
        let RegExpp = new RegExp('[\\u4E00-\\u9FFF]', 'g')
        return RegExpp.test(str)
    }
    let nickName = decodeURIComponent(userInfo.c_nk) ? decodeURIComponent(userInfo.c_nk) : ''
    let propsName = props.name ? props.name : ''
    let resNick = (propsName || nickName).toUpperCase()
    let resNickname = checkCh(resNick) ? resNick.slice(0, 1) : resNick.slice(0, 2)

    const getTheme = str => {
        let strLength = str.length
        let colorIndex = Math.ceil(strLength % 5)
        switch (colorIndex) {
            case 0:
                return 'avatar-color-0'
            case 1:
                return 'avatar-color-1'
            case 2:
                return 'avatar-color-2'
            case 3:
                return 'avatar-color-3'
            case 4:
                return 'avatar-color-4'
            default:
                return 'avatar-color-0'
        }
    }

    return (
        <span
            className={getTheme(resNick)}
            style={{
                borderRadius: '50%',
                color: '#fff',
                overflow: 'hidden',
                width: '25px',
                height: '25px',
                display: 'inline-block',
                lineHeight: '25px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'lighter',
                cursor: 'pointer',
                marginRight: '4px',
                verticalAlign: 'middle'
            }}>
            {resNickname}
        </span>
    )
}

export default HeaderC

import React, { useState, useEffect, useReducer } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Layout, BackTop, message } from 'antd'
import echarts from 'echarts/lib/echarts'
import routes from '@/routes'
import menus from '@/routes/menus'
import avatar from '@/assets/images/user.png'
import '@/style/layout.less'
import { areaReducer } from '../reducers/areaReducers'

import AppHeader from './AppHeader.jsx'
import AppAside from './AppAside.jsx'
import AppFooter from './AppFooter.jsx'
import { APIgetAreaList, APILogout } from '@/mapi'
import Cookies from 'js-cookie'

export const AreaContext = React.createContext(null)

const { Content } = Layout

const MENU_TOGGLE = 'menuToggle'

const reducer = (state, action) => {
    switch (action.type) {
        case MENU_TOGGLE:
            return { ...state, menuToggle: !state.menuToggle }
        default:
            return state
    }
}

const ascription = [
    { label: '黄烨港', value: '1', key: '1' },
    { label: '可亏损', value: '2', key: '2' }
]

const DefaultLayout = props => {
    const userIfo = JSON.parse(localStorage.getItem('userInfo'))

    const getMenu = menus => {
        console.log('menus', menus)
        return menus
            .filter(item => {
                return !item.au || (item.au && !(userIfo?.id == '10008' || userIfo?.id == '10009'))
            })
            .map(item => {
                item = Object.assign({}, item)
                if (item.subs) {
                    item.subs = getMenu(item.subs)
                }
                return item
            })
    }

    const [menu] = useState(prevState => {
        if (!Cookies.get('crm_user_info')) {
            props.history.push('/login')
            return []
        } else {
            return getMenu(menus)
        }
        return getMenu(menus)
    })

    const [state, dispatch] = useReducer(reducer, { menuToggle: false })

    let { auth } = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : ''

    const menuClick = () => {
        dispatch({ type: 'menuToggle' })
    }

    const [areaState, areaDispatch] = useReducer(areaReducer, {
        area: '',
        areaList: []
    })

    const loginOut = () => {
        APILogout().then(resp => {
            props.history.push('/login')
            localStorage.clear()
            message.success('登出成功!')
        })
    }

    const gotoAmountDetail = () => {
        props.history.push('/amountDetail')
    }

    const gotoIntegralDetail = () => {
        props.history.push('/integralDetail')
    }

    const gotoModifyPwd = () => {
        props.history.push('/modify_pwd')
    }

    const gotoAddAccount = () => {
        props.history.push('/addAccount')
    }
    const gotoNotify = () => {
        props.history.push('/myNotify')
    }
    const gotoSystemConfig = () => {
        props.history.push('/systemConfig')
    }
    const gotoIndex = () => {
        props.history.push('/index')
    }
    const gotoRuleConfig = () => {
        props.history.push('/ruleConfig')
    }
    const gotoHomeConfig = () => {
        props.history.push('/homeConfig')
    }
    const gotoLevelScoreConfig = () => {
        props.history.push('/levelScoreConfig')
    }

    useEffect(() => {
        let { pathname } = props.location
        let timer
        // getAreaList()

        // 菜单收缩展开时 echarts 图表的自适应
        // if (pathname === '/' || pathname === '/index') {
        //     timer = setTimeout(() => {
        //         echarts.init(document.getElementById('bar')).resize()
        //         echarts.init(document.getElementById('line')).resize()
        //         echarts.init(document.getElementById('pie')).resize()
        //         echarts.init(document.getElementById('pictorialBar')).resize()
        //         echarts.init(document.getElementById('scatter')).resize()
        //     }, 500)
        // } else {
        //     timer = null
        // }
        // return () => {
        //     timer && clearTimeout(timer)
        // }
    }, [])

    return (
        <AreaContext.Provider value={{ areaState, dispatch: areaDispatch }}>
            <Layout className='app'>
                <BackTop />
                <AppAside menuToggle={state.menuToggle} menu={menu} />
                <Layout style={{ minHeight: '100vh' }}>
                    <AppHeader
                        menuToggle={state.menuToggle}
                        menuClick={menuClick}
                        avatar={avatar}
                        loginOut={loginOut}
                        ascription={ascription}
                        gotoAmountDetail={gotoAmountDetail}
                        gotoIntegralDetail={gotoIntegralDetail}
                        gotoModifyPwd={gotoModifyPwd}
                        gotoAddAccount={gotoAddAccount}
                        gotoNotify={gotoNotify}
                        gotoSystemConfig={gotoSystemConfig}
                        gotoIndex={gotoIndex}
                        gotoRuleConfig={gotoRuleConfig}
                        gotoHomeConfig={gotoHomeConfig}
                        gotoLevelScoreConfig={gotoLevelScoreConfig}
                    />
                    <Content className='content'>
                        <Switch>
                            {routes.map(item => {
                                return (
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        exact={item.exact}
                                        render={props =>
                                            !auth ? (
                                                <item.component {...props} />
                                            ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                                                <item.component {...props} />
                                            ) : (
                                                // 这里也可以跳转到 403 页面
                                                <Redirect to='/404' {...props} />
                                            )
                                        }
                                    />
                                )
                            })}
                            <Redirect to='/404' />
                        </Switch>
                    </Content>
                    <AppFooter />
                </Layout>
            </Layout>
        </AreaContext.Provider>
    )
}

export default withRouter(DefaultLayout)

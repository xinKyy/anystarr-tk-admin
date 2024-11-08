import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Button, message } from 'antd'
import BraftEditor from 'braft-editor'
import '@/style/view-style/index.less'
import '@/style/view-style/editor.less'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import 'braft-editor/dist/index.css'
import { APImodifySystemConfig, APIgetSysConfig } from '@/mapi'

const EditorView = () => {
    const [state, setState] = useState({
        editorState: BraftEditor.createEditorState(''),
        outputHTML: ''
    })

    let { editorState, outputHTML } = state

    useEffect(() => {
        let timer = setTimeout(() => {
            setState(prevState => {
                return {
                    ...prevState,
                    editorState: BraftEditor.createEditorState('')
                }
            })
        }, 3000)
        return () => {
            clearTimeout(timer)
        }
    }, [state])

    let editorChange = editorState => {
        setState(prevState => {
            return { ...prevState, editorState, outputHTML: editorState.toHTML() }
        })
    }

    const handleClick = () => {
        console.log('输出', state.outputHTML)
        const params = {
            key: 'system_title',
            value: state.outputHTML,
            description: '桃岭生态系统'
        }
        APImodifySystemConfig(params)
            .then(res => {
                console.log('xixi')
                message.success('修改成功')
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const getHomeConfig = () => {
        APIgetSysConfig({
            limit: 10,
            offset: 0
        })
            .then(res => {
                let config = res.data.filter(item => {
                    return item.key === 'system_title'
                })
                setState({
                    ...state,
                    editorState: BraftEditor.createEditorState(config[0].value)
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        getHomeConfig()
    }, [])

    return (
        <Layout className='animated fadeIn'>
            <div>
                <WebBreadcrumb arr={['首页配置']} />
            </div>
            <div className='base-style'>
                <h3>首页配置</h3>
                <Divider />
                <p>首页的长啥样你来定</p>
            </div>
            <div className='base-style'>
                <div className='editor'>
                    <BraftEditor value={editorState} onChange={editorChange} />
                </div>
            </div>
            <div className='base-style'>
                <Button onClick={handleClick} type='primary' style={{ float: 'right' }}>
                    发布
                </Button>
            </div>
        </Layout>
    )
}

export default EditorView

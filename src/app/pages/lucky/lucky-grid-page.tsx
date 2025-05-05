"use client"

import React, { useState, useRef, useEffect } from 'react'
// @ts-ignore
import { LuckyGrid } from '@lucky-canvas/react'
import { draw, drawTen, queryRaffleAwardList } from "@/apis"

import { RaffleAwardVO } from "@/types/RaffleAwardVO"

interface LuckyGridMethods {
    play: () => void
    stop: (index: number) => void
}

interface Prize {
    x: number
    y: number
    fonts: Array<{
        text: string
        top: string
        fontSize: string
        fontWeight: string
    }>
    imgs: Array<{
        src: string
        width: string
        height: string
        activeSrc?: string
    }>
}

export function LuckyGridPage({ handleRefresh }: { handleRefresh: () => void }) {
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const myLucky = useRef<LuckyGridMethods>()
    const [isTenDrawing, setIsTenDrawing] = useState(false) // 需要恢复这个状态

    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search)
        const userId = String(queryParams.get('userId'))
        const activityId = Number(queryParams.get('activityId'))

        try {
            const result = await queryRaffleAwardList(userId, activityId)
            const { code, info, data } = await result.json()

            if (code !== "0000") {
                window.alert(`获取奖品列表失败 code:${code} info:${info}`)
                return
            }

            const newPrizes: Prize[] = [
                {
                    x: 0, y: 0,
                    fonts: [{ text: data[0].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800' }],
                    imgs: [{
                        src: "/raffle-award-00.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 1, y: 0,
                    fonts: [{ text: data[1].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800' }],
                    imgs: [{
                        src: "/raffle-award-01.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 2, y: 0,
                    fonts: [{ text: data[2].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800' }],
                    imgs: [{
                        src: "/raffle-award-02.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 2, y: 1,
                    fonts: [{ text: data[3].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800' }],
                    imgs: [{
                        src: "/raffle-award-12.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 2, y: 2,
                    fonts: [{
                        text: data[4].isAwardUnlock ? data[4].awardTitle : `再抽奖${data[4].waitUnLockCount}次解锁`,
                        top: '80%',
                        fontSize: '12px',
                        fontWeight: '800'
                    }],
                    imgs: [{
                        src: data[4].isAwardUnlock ? "/raffle-award-22.png" : "/raffle-award-22-lock.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 1, y: 2,
                    fonts: [{
                        text: data[5].isAwardUnlock ? data[5].awardTitle : `再抽奖${data[5].waitUnLockCount}次解锁`,
                        top: '80%',
                        fontSize: '12px',
                        fontWeight: '800'
                    }],
                    imgs: [{
                        src: data[5].isAwardUnlock ? "/raffle-award-21.png" : "/raffle-award-21-lock.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 0, y: 2,
                    fonts: [{
                        text: data[6].isAwardUnlock ? data[6].awardTitle : `再抽奖${data[6].waitUnLockCount}次解锁`,
                        top: '80%',
                        fontSize: '12px',
                        fontWeight: '800'
                    }],
                    imgs: [{
                        src: data[6].isAwardUnlock ? "/raffle-award-20.png" : "/raffle-award-20-lock.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                },
                {
                    x: 0, y: 1,
                    fonts: [{ text: data[7].awardTitle, top: '80%', fontSize: '12px', fontWeight: '800' }],
                    imgs: [{
                        src: "/raffle-award-10.png",
                        width: "100px",
                        height: "100px",
                        activeSrc: "/raffle-award.png"
                    }]
                }
            ]

            setPrizes(newPrizes)
        } catch (error) {
            console.error('获取奖品列表失败:', error)
            window.alert("获取奖品信息失败，请刷新页面")
        }
    }

    const randomRaffleHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search)
        const userId = String(queryParams.get('userId'))
        const activityId = Number(queryParams.get('activityId'))

        try {
            const result = await draw(userId, activityId)
            const { code, info, data } = await result.json()

            if (code !== "0000") {
                window.alert(`随机抽奖失败 code:${code} info:${info}`)
                return -1
            }

            handleRefresh()
            return data.awardIndex - 1
        } catch (error) {
            console.error('抽奖异常:', error)
            return -1
        }
    }

    const handleTenDraw = async () => {
        const queryParams = new URLSearchParams(window.location.search)
        const userId = String(queryParams.get('userId'))
        const activityId = Number(queryParams.get('activityId'))

        try {
            setIsDrawing(true)
            setIsTenDrawing(true)
            myLucky.current?.play()

            const result = await drawTen(userId, activityId)
            const { code, info, data } = await result.json()

            if (code !== "0000") {
                window.alert(`十连抽失败 code:${code} info:${info}`)
                setIsDrawing(false)
                setIsTenDrawing(false)
                return
            }

            // 延迟停止转盘，等待动画播放完
            setTimeout(() => {
                if (myLucky.current) {
                    myLucky.current.stop(-1) // 停止转盘但不选择奖品
                }

                setTimeout(() => {
                    window.alert(`🎉 十连抽中奖结果如下:
${data.awardTitleList?.map((t, i) => `${i + 1}. ${t}`).join('\n')}
恭喜你获得以上奖品！`)
                    setIsDrawing(false)
                    setIsTenDrawing(false)
                }, 500) // 停止后延迟显示结果
            }, 4000) // 根据实际动画时长调整
        } catch (error) {
            console.error('十连抽异常:', error)
            window.alert("网络请求异常")
            setIsDrawing(false)
            setIsTenDrawing(false)
        }
    }

    useEffect(() => {
        queryRaffleAwardListHandle()
    }, [])

    return (
        <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fe',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div style={{
                position: 'relative',
                flex: 1,
                minHeight: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <LuckyGrid
                    ref={myLucky}
                    width="300px"
                    height="310px"
                    rows="3"
                    cols="3"
                    prizes={prizes}
                    buttons={[{
                        x: 1,
                        y: 1,
                        background: "#7f95d1",
                        imgs: [{ src: "/raffle-button.png", width: "100px", height: "100px" }]
                    }]}
                    onStart={() => {
                        if (!myLucky.current) return
                        myLucky.current.play()
                        if (!isTenDrawing) {
                            setTimeout(async () => {
                                const index = await randomRaffleHandle()
                                if (index !== -1 && myLucky.current) {
                                    myLucky.current.stop(index)
                                }
                            }, 2500)
                        }
                    }}
                    onEnd={(prize: Prize) => {
                        if (!isTenDrawing) {
                            alert(`恭喜抽中奖品：${prize.fonts[0]?.text || '未知奖品'}`)
                            queryRaffleAwardListHandle()
                        }
                    }}
                />
            </div>

            <div style={{
                marginTop: '5px',
                padding: '0px 0px'
            }}>
                <button
                    style={{

                        width: '300px',
                        height: '100px',
                        marginTop: '20px', // 可以根据需要调整上边距
                        backgroundColor: '#4CAF50', // 按钮背景颜色
                        color: 'white', // 字体颜色
                        border: 'none', // 去掉边框
                        borderRadius: '5px', // 圆角边框
                        fontSize: '50px', // 字体大小
                        cursor: 'pointer' // 鼠标样式
                    }}
                    onClick={handleTenDraw}
                >
                    <img
                        src="/ten-raffle-button.png"
                        alt="十连抽按钮"
                        style={{
                            width: '300px',  // 根据需求调整图片大小
                            height: '100px',
                        }}
                    />
                </button>
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

"use client"

import React, { useEffect, useState } from 'react'

interface AwardRecord {
    awardTitle: string
    awardTime: string // 调整为字符串类型
}

export function LuckyWheelPage({ handleRefresh }: { handleRefresh: () => void }) {
    const [awardRecords, setAwardRecords] = useState<AwardRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAwardRecords = async () => {
        try {
            const queryParams = new URLSearchParams(window.location.search)
            const userId = queryParams.get('userId')

            if (!userId) {
                throw new Error('用户ID参数缺失')
            }

            // 完整接口路径
            const response = await fetch('http://localhost:1000/api/v1/raffle/activity/query_user_award_record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            })

            console.log('接口响应状态:', response.status)
            const result = await response.json()
            console.log('接口返回数据:', result)

            if (result.code !== "0000") {
                throw new Error(result.info || '接口返回错误')
            }

            // 处理日期字符串
            const processedData = result.data.map((record: any) => ({
                awardTitle: record.awardTitle,
                awardTime: new Date(record.awardTime).getTime() // 转换为时间戳
            }))

            setAwardRecords(
                processedData
                    .sort((a, b) => b.awardTime - a.awardTime)
                    .slice(0, 10)
            )

        } catch (error) {
            console.error('数据获取失败:', error)
            if (isLoading) {
                window.alert("暂时无法获取中奖记录，请稍后再试")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true
        const intervalId = setInterval(() => {
            if (isMounted) fetchAwardRecords()
        }, 5000)

        fetchAwardRecords()

        return () => {
            isMounted = false
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div style={{
            width: '300px',
            height: '500px',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'relative'
        }}>
            <h3 style={{
                fontSize: '18px',
                color: '#2d3748',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>🎉</span>
                最近10条中奖记录
                {isLoading && (
                    <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #e2e8f0',
                        borderTopColor: '#4299e1',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                )}
            </h3>

            <div style={{
                height: 'calc(100% - 45px)',
                overflowY: 'auto',
                paddingRight: '8px'
            }}>
                {awardRecords.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#718096',
                        padding: '40px 0',
                        fontSize: '14px'
                    }}>
                        {isLoading ? '加载中...' : '暂无中奖记录'}
                    </div>
                ) : (
                    awardRecords.map((record, index) => (
                        <div key={index} style={{
                            padding: '12px',
                            marginBottom: '8px',
                            background: '#f7fafc',
                            borderRadius: '8px',
                            transition: 'transform 0.2s',
                            ':hover': {
                                transform: 'translateX(5px)'
                            }
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{
                                        fontWeight: '600',
                                        color: '#2d3748',
                                        marginBottom: '4px'
                                    }}>
                                        {record.awardTitle}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#718096'
                                    }}>
                                        {new Date(record.awardTime).toLocaleDateString()}
                                        {' '}
                                        {new Date(record.awardTime).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#4299e1',
                                    fontWeight: 'bold'
                                }}>
                                    #{index + 1}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

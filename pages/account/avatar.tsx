/****************************
© 2019-present LeagueXP. All rights reserved.
****************************/

import Head from 'next/head'
import { useMemo, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Account() {
    let [user, setUser] = useState<any>()
    let router = useRouter()

    useMemo(async () => {
        onAuthStateChanged(getAuth(), user => {
            if (user) {
                setUser(user)

                const subscribe = (event: any) => {
                    try {
                        const json = JSON.parse(event.data);
                        if (json?.source !== 'readyplayerme') return
                        if (json.eventName === 'v1.frame.ready') {
                            document.querySelector('iframe')?.contentWindow?.postMessage(
                                JSON.stringify({
                                    target: 'readyplayerme',
                                    type: 'subscribe',
                                    eventName: 'v1.**'
                                }),
                                '*'
                            )
                        }
                        if (json.eventName === 'v1.avatar.exported') {
                            console.log(json.data.url)
                            router.push('/account')
                        }
                    } catch {}
                }

                window.addEventListener('message', subscribe)
                document.addEventListener('message', subscribe)
            } else {
                useRouter().push('/account')
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>Account | Parakeet Games</title>
            </Head>
            <div style={{ textAlign: 'center' }}>
                <div style={{ border: 'none', width: '100vw', height: '94vh', position: 'fixed', left: 0, background: 'white' }} />
                {user && <iframe style={{ border: 'none', width: '100vw', height: '94vh', position: 'fixed', left: 0 }} src='https://parakeet.readyplayer.me/avatar?frameApi' allow='microphone *; camera *'></iframe>}
            </div>
        </>
    )
}

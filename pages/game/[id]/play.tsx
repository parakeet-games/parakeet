/****************************
© 2019-present Samuel Sharp. All rights reserved.
****************************/

import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { RWebShare } from 'react-web-share'
import { readdirSync } from 'fs'

function GamePage(props: any) {
	let [user, setUser] = useState<User>()
	let [userStateDetermined, setUserStateDetermined] = useState<boolean>(false)

	useEffect(() => {
		window.addEventListener('message', (event) => {
			if (typeof event.data == 'object') {
				if (event.data.title && event.data.description && event.data.parakeetMessageType == 'achievement') {
					$('.popupTitle').text(event.data.title)
					$('.popupDescription').text(event.data.description)
					$('.popup').show()
					setTimeout(() => $('.popup').fadeOut(500), 2000)
				}
			}
		})

		// Make sure iframe stays in focus
		if (typeof document !== 'undefined') {
			setInterval(() => {
				try {
					((document.getElementById(`frame-${game.id}`) as HTMLIFrameElement).contentWindow as any).focus()
				} catch {}
			}, 400)
		}
	})

	useMemo(async () => {
		onAuthStateChanged(getAuth(), async (user) => {
			try {
				if (user) {
					setUser(user)
					if (typeof document !== 'undefined') {
						(document.querySelector('#frame-' + props.game.id) as HTMLIFrameElement).setAttribute('src', `${props.game.frame}?user=${await user.getIdToken()}`)
					}
				} else {
					if (typeof document !== 'undefined') {
						(document.querySelector('#frame-' + props.game.id) as HTMLIFrameElement).setAttribute('src', props.game.frame)
					}
				}
				setUserStateDetermined(true)
			} catch {}
		})
	}, [])

	let router = useRouter()

	let game = props.game

	return (
		<>
			<Head>
				<title>{`${game.name} on Parakeet`}</title>
			</Head>
			<div className='popup'>
				<span className='material-symbols-outlined popupIcon'>social_leaderboard</span>
				<span className='popupContent'>
					<span className='popupTitle'></span>
					<br />
					<span className='popupDescription'></span>
					<br /><br />
					<i>This is a DEMO MODE achievement and will not save to your account.</i>
				</span>
			</div>
			<iframe
				id={`frame-${props.game.id}`}
				sandbox="allow-scripts allow-same-origin"
				style={{
					width: '100vw',
					height: '100vh',
					position: 'fixed',
					bottom: '0',
					border: 'none',
					zIndex: 100,
				}}
			></iframe>
		</>
	)
}

export async function getStaticPaths() {
	const allGames: any[] = []
	readdirSync('apps').forEach((game) => {
		allGames.push(game)
	})

	return {
		paths: allGames.map((game: any) => {
			return {
				params: {
					id: game.toString().replace('.json', ''),
				},
			}
		}),
		fallback: false,
	}
}

export async function getStaticProps({ params }: any) {
	return {
		props: {
			game: { ...require(`../../../apps/${params.id}.json`), id: params.id },
		},
	}
}

export default GamePage
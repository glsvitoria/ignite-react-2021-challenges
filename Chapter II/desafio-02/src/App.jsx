import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './routes'

import { GlobalStyle } from './styles/global'

export function App() {
	return (
		<>
			<GlobalStyle></GlobalStyle>
			<Router>
				<Routes />
			</Router>
		</>
	)
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = createRoot(document.getElementById('root')!)

if (import.meta.env.DEV && window.location.pathname === '/prototype/design') {
  import('./prototype/DesignPrototype').then(({ default: DesignPrototype }) => {
    root.render(
      <StrictMode>
        <DesignPrototype />
      </StrictMode>,
    )
  })
} else {
  root.render(<StrictMode><App /></StrictMode>)
}

import Script from 'next/script'
import '../styles/shared/global.css'
import QueryProvider from './lib/Providers'
import ReduxProvider from './redux/provider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Allpixels from '../components/admin/pixel/Allpixels'


export const metadata = {
  title: 'Drawlys',
  description: 'the best choice',
}

export default async function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Allpixels/>
      </head>
      <body>
        <ReduxProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
      <GoogleAnalytics gaId="G-4HR9W978KD" />
    </html>
  )
}

import '../styles/shared/global.css'
import QueryProvider from './lib/Providers'
import ReduxProvider from './redux/provider'



export const metadata = {
  title: 'Drawlys',
  description: 'the best choice',
}

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReduxProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}

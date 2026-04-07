import './globals.css'

export const metadata = {
  title: 'Chala Worku Question Center',
  description: 'Practice your quiz with style',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

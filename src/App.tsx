import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a 
          href="https://vite.dev" 
          target="_blank" 
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img 
            src={viteLogo} 
            className="h-24 w-24 hover:drop-shadow-[0_0_2em_#646cffaa]" 
            alt="Vite logo" 
          />
        </a>
        <a 
          href="https://react.dev" 
          target="_blank"
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img 
            src={reactLogo} 
            className="h-24 w-24 animate-spin hover:drop-shadow-[0_0_2em_#61dafbaa]" 
            alt="React logo"
            style={{ animationDuration: '20s' }}
          />
        </a>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Vite + React
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-600">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-gray-500 mt-8 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
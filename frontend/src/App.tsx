import { useEffect, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000")

function App() {
  const [content, setContent] = useState("")
  // const [recievedContentFromServer, setRecievedContentFromServer] = useState("")
  // const [contentToDisplay, setContentToDisplay] = useState("")
  const [timeOutId, setTimeOutId] = useState<any>("")
  const [isTextAreaInFocus, setIsTextAreaInFocus] = useState(false)

  useEffect(() => {
    console.log(content)

    socket.on('connect', () => {
      console.log("connected to web socket")
    })

    socket.on('receive_message', (data) => {
      // console.log("this is edited")
      console.log("this is the received content from the server: ", data)
      setContent(data)
      // setRecievedContentFromServer(data)
    })
  }, [])

  useEffect(() => {

    if (!isTextAreaInFocus) {
      return
    }

    if (content === "") {
      return
    }

    if (timeOutId) {
      clearTimeout(timeOutId)
    }

    const id = setTimeout(() => {
      console.log("sending message")
      sendMessage()
    }, 500);

    setTimeOutId(id)

    return () => {
      clearTimeout(id)
    }
  }, [content])

  function sendMessage() {
    socket.emit('send_message', content)
  }

  return (
    <div>
      <div>
        <h1>live text</h1>
      </div>
      <div>

        <textarea id="message" rows={8}
          onFocusCapture={() => {
            setIsTextAreaInFocus(true)
            console.log("focused")
          }}
          onBlurCapture={() => {
            setIsTextAreaInFocus(false)
            console.log("blurred")
          }}
          value={content}
          onChange={(e) => {
            // document.hidden && sendMessage()
            setContent(e.target.value)
          }}
          className="block p-2.5 w- w-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

      </div>
    </div>
  )
}

export default App

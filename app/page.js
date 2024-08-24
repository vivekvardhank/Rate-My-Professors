'use client'

import { useState, useEffect, useRef } from "react";
import { Box, TextField, Stack, Button, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I am a Rate My Professors Agent. How can I help you today?"
    }
  ]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === '') return; 
    setLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);
  
    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...messages, { role: "user", content: message }])
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      const processText = async ({ done, value }) => {
        if (done) {
          setLoading(false);
          return result;
        }

        const text = decoder.decode(value || new Uint8Array(), { stream: true });

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }
          ];
        });

        return reader.read().then(processText);
      };

      await reader.read().then(processText);
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      event.preventDefault(); 
      sendMessage(); 
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"  // Light background color for better readability
      p={3}
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="1px solid #ccc"  // Light gray border
        borderRadius={4}  // Rounded corners for a modern look
        bgcolor="white"  // White background for the chatbox
        boxShadow={2}  // Slight shadow for depth
        p={2}
        spacing={3}
      >
        <Typography variant="h6" align="center">
          Rate My Professors
        </Typography>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100%'}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                }
                color="white"
                borderRadius={11}
                p={3}
                maxWidth="80%"
              >
               <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyPress}
          />
          <Button variant="contained" onClick={sendMessage} disabled={loading}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

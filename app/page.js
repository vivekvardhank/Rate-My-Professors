'use client'

import { styled } from '@mui/system';
import { Box, Stack, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


const CustomScrollBox = styled(Stack)({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px', 
  },
  '&::-webkit-scrollbar-track': {
    background: '#333333', 
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#555555', 
    borderRadius: '10px', 
    border: '2px solid #333333', 
  },
  '&': {
    scrollbarWidth: 'thin', 
    scrollbarColor: '#555555 #333333', 
  },
});

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
      bgcolor="#121212"
      p={3}
      sx={{
        '@media (max-width: 600px)': {
          width: '100vw',
          height: '100vh',
          padding: '0',
        },
      }}
    >
      <CustomScrollBox
        direction="column"
        width="100%"
        maxWidth="450px"
        height="100%"
        maxHeight="600px"
        border="1px solid #333333"
        borderRadius={8}
        bgcolor="#1f1f1f"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.5)"
        p={3}
        spacing={3}
        sx={{
          '@media (max-width: 600px)': {
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: 0,
            boxShadow: 'none',
            border: 'none',
            padding: '16px',
          },
        }}
      >
        <Typography variant="h5" align="center" color="#e0e0e0">
          Rate My Professors
        </Typography>
        <CustomScrollBox
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          paddingX={2}
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
                  message.role === 'assistant' ? '#2d6a4f' : '#457b9d'
                }
                color="white"
                borderRadius={2}
                p={1.5}
                maxWidth="75%"
                boxShadow="0px 2px 8px rgba(0, 0, 0, 0.5)"
                sx={{
                  '& ul, & ol': {
                    paddingLeft: '10px',
                    marginLeft: '7px',
                  },
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </CustomScrollBox>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            variant="outlined"
            InputLabelProps={{
              style: {
                color: '#e0e0e0'
              },
            }}
            InputProps={{
              style: {
                color: '#e0e0e0',
                borderRadius: 25,
                backgroundColor: '#333333',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={loading}
            style={{
              borderRadius: 25,
              minWidth: '80px',
              backgroundColor: '#457b9d',
              color: '#ffffff'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </Button>
        </Stack>
      </CustomScrollBox>
    </Box>
  );
}

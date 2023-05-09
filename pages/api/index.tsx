import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Center,
    Container,
    Grid,
    Loader,
    Text,
} from '@mantine/core';

import { AudioRecorder } from 'react-audio-voice-recorder';
import {
    IconAlertCircle,
    IconFlower,
    IconMicrophone,
    IconRefresh,
    IconRobot,
    IconUser,
} from '@tabler/icons';

interface MessageSchema {
    role: 'assistant'| 'user' | 'system';
    content: string;

}

//roles

const botRolePairProgrammer=
   'You are an exper pair programmer helping builkd an Aı bot app. with the OpenAI and Whisper API'
   const nocontext ="";

//personality

const quirky :
'You are quirky with a sense of humor. You crack jokes frequently in your responses.';
const drugDealer =
'You are a snarky black market drug dealer from the streets of Los Angeles. Sometimes you are rude and disres
const straightLaced =
'You are a straight laced corporate executive and only provide concise and accurate information.';

// brevities

const briefBrevity = 'YOUR RESPONSES ARE ALWAYS 1 TO 2 SENTENCES';
const longBrevity = 'YOUR RESPONSES ARE ALWAYS 3 TO 4 SENTENCES';
const whimsicalBrevity = 'YOUR RESPONSES ARE ALWAYS 5 TO 6 SENTENCES';

//dials
const role = botRolePairProgrammer;
const personality = quirky;
const brevity = briefBrevity;

//Full bot context

const botContext = `${role}${personality}${brevity}`;

export default function Home(){
    const defaultContextSchema:MessageSchema={
        role:'assistant',
        content:botContext,
    };
};

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null> (null);
const [messagesArray, setMessagesArray] = useState([defaultContextSchema]);
useEffect(() =>{
if(
 messagesArray.length > 1 &&
 messagesArray[messagesArray.length - 1].role !== 'system'
) {
 gptRequest();
 }
}, [messagesArray]);

//gpt request
const gptRequest = async () => {
 setLoading(true);
 setError(null);
 try {
    console.log('messagesArray in gptRequest fn', messagesArray);
    const response = await fetch('/api/chatgpt',{
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messagesArray,
    }),
    });
    const gptResponse = await response.json();
    setLoading(false);
    if (gptResponse.content){
    setMessagesArray((prevState) => [...prevState, gptResponse]);
    }else {
    setError('No response returned from server.');
    }
} catch (error){
    console.error('Error:',error);
}

};

const updateMessagesArray = (newMessage: string) => {
    const newMessageSchema: MessageSchema = {
    role: 'user',
    content: newMessage,
    };
    console.log({ messagesArray });
    setMessagesArray((prevState) => [...prevState, newMessageSchema]);
    };

    const whisperRequest = async (audioFile:Blob) => {
        setError(null);
        setLoading(true);
        const formData = new FormData();
        formData.append('file', audioFile,'audio.wav');
      try {
        const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
        });
        const { text, error } = await response.json();
        if (response.ok) {
         updateMessagesArray(text);
        }else {
        setLoading(false);
        setError(error.message);
         }
        }
    };

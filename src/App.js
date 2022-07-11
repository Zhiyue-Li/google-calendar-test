import { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import axios from 'axios'

import './App.css';

const App = () => {
  const [authentication, setAuthentication] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (window.location.hash) {
      processHash(window.location.hash)
    }
  }, [])

  const processHash = (hash) => {
    const keyValuePairs = hash.slice(1).split('&')
    const params = {}
    keyValuePairs.forEach(keyValuePair => {
      const [key, value] = keyValuePair.split('=')
      params[key] = value
    });
    setAuthentication(params)
  }

  const fetchData = () => {
    if (authentication) {
      axios.get(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent('zyli@beaconfireinc.com')}/events`, {
        headers: {
          'Authorization': `${authentication['token_type']} ${authentication['access_token']}`
        }
      })
        .then((res) => {
          console.log(res.data.items);
          setEvents(res.data.tiems)
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else {
      alert('You need to authenticate before fetching data')
    }
  }

  const handleAuthorize = () => {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth?'
    const scope = 'scope=https%3A//www.googleapis.com/auth/calendar%20https%3A//www.googleapis.com/auth/calendar.events'
    const include_granted_scopes = 'include_granted_scopes=true'
    const response_type = 'response_type=token'
    const redirect_uri = 'redirect_uri=http%3A//localhost:3000'
    const client_id = 'client_id=403417443434-kk1ueu9sj4k1oilu7vc2focb8lf5qno3.apps.googleusercontent.com'
    const queryParams = [scope, include_granted_scopes, response_type, redirect_uri, client_id].join('&')
    const url = baseUrl + queryParams
    window.open(url)
  }

  const onSelect = (selectionInfo) => {
    console.log(selectionInfo.startStr)
    console.log(selectionInfo.endStr)
  }

  return (
    <div className="App">
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <button className='fetch-data-button' onClick={handleAuthorize}>Authorize</button>
        <button className='fetch-data-button' onClick={fetchData}>Fetch Data</button>
        {events && events.map(event => (
          <div key={event.summary}>
            {event.summary}
          </div>
        ))}
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin ]}
          events={events}
          initialView={'timeGridWeek'}
          allDaySlot={true}
          slotDuration={'00:15:00'}
          slotLabelInterval={'01:00:00'}
          selectable={true}
          select={onSelect}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth'
          }}
          dateClick={(info) => {}}
        />
      </div>
    </div>
  );
}

export default App;

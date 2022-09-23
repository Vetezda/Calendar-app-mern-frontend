import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, 
         onDeleteEvent, 
         onSetActiveEvent, 
         onUpdateEvent,
         onLoadEvents } from "../store";


export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {  
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingNewEvent = async( calendarEvent ) => {

      try {
        if (calendarEvent.id) {
          //Actualiza
          await calendarApi.put( `/events/${calendarEvent.id}`, calendarEvent );
          dispatch( onUpdateEvent( {...calendarEvent, user } ));
          return;
        }
          //Crea
          const { data } = await calendarApi.post('/events', calendarEvent);
          dispatch( onAddNewEvent( { ...calendarEvent, id: data.evento.id, user } ));
        
      } catch (error) {
        console.log(error);
        Swal.fire('Error, No se pudo guardar el evento', error.response.data.msg, 'error' );
      }  

    }

    const startLoadingEvents = async() => {

      try {
        const { data } = await calendarApi.get('/events');
        const events =  convertEventsToDateEvents( data.eventos );
        dispatch( onLoadEvents( events ) );  
        
      } catch (error) {
        console.log('Error al cargar los eventos');
        console.log(error);
      }
    }

    const startDeletingEvent = async() => {
      try {

        await calendarApi.delete( `/events/${activeEvent.id}` );
        dispatch( onDeleteEvent() );

      } catch (error) {
        console.log(error);
        Swal.fire('Error, No se puede eliminar este evento', error.response.data.msg, 'error' );
      }
    }

  return {
    //Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Métodos
    setActiveEvent,
    startSavingNewEvent,
    startDeletingEvent,
    startLoadingEvents,
  }

}

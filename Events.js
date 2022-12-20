import EventEmitter from 'events'

/**
 * @typedef {["FuncLoaded" | "Log", ...any[]]} eventsDef
 * @event
 */

class AppBot_Emitter extends EventEmitter {

    /**
     * @param {eventsDef} args
     */
    addListener(...args) {
      super.addListener(...args);a
    }
  
    /**
     * @param {eventsDef} args
     */
    on(...args) {
      super.on(...args);
    }
  
  }

export default AppBot_Emitter
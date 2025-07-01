import './App.css';
import Boards from './Boards';
import trelloLogo from './trello-logo.gif';
import { useReducer, createContext, useState, useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export const stateContext = createContext({})

function App() {

  const initialState = {
    "To Do" : ["Redux", "Authetication", "Project"],
    "In Progress" : ["Trello Project"],
    "Done" : ["Props","Hooks","JSX"]
  }

  const reducer = (state, {type, payload}) => {
    switch(type){
      case 'add' :
        return{
          ...state,
          [payload.title]: [...state[payload.title], payload.value]
        }
      
      case 'Drag-Drop':
      if(payload.fromBoard === payload.toBoard){
        let copyBoard = [...state[payload.fromBoard]];
        console.log(copyBoard);
        const [movedItem] = copyBoard.splice(payload.fromIndex, 1); 
        console.log(copyBoard);
        
        copyBoard.splice(payload.toIndex, 0, movedItem);  
        console.log(copyBoard);
        
        return {
            ...state,
            [payload.fromBoard]: copyBoard
        }
    }

    let copyFrom = [...state[payload.fromBoard]];
    let copyTo = [...state[payload.toBoard]];
    copyTo.splice(payload.toIndex, 0, copyFrom[payload.fromIndex]);
    copyFrom.splice(payload.fromIndex, 1);

    return {
        ...state,
        [payload.fromBoard]: copyFrom,
        [payload.toBoard]: copyTo
    }

    case 'edit' :
      const copyBoard = state[payload.title]
      copyBoard.splice(payload.index,1,payload.value)

      return{
        ...state,
        [payload.title]:copyBoard
      }

    case 'delete' :
      const copyB = state[payload.title]
      copyB.splice(payload.index, 1)

      return{
        ...state,
        [payload.title]:copyB
      }
    
    case 'addList' :
      return{
        ...state,
        [payload.value] : []
      }

    default:
      return state;

    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [addList, setAddList] = useState(false)
  const listRef = useRef(null)

  const handleList = () =>{
    if(listRef.current.value.trim() == '') return
    dispatch({
      type : 'addList',
      payload : {value : listRef.current.value}
    })
    setAddList(false);
    listRef.current.value='';
  }


  return (
    <stateContext.Provider value={{state, dispatch}}>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <div className='logo-div'>
            <img src={trelloLogo} height='15px' width='80px' style={{margin:'10px'}} alt='trello-logo' />
          </div>
          <div>
            <div className='boards'>
                {Object.keys(state).map((key)=>(
                  <Boards title={key} />
                ))}
                {
              !addList ? <div><p onClick={()=>setAddList(true)} className='addListBtn'>+ Add Another List</p></div> : 
              <div className='board' style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <input ref={listRef} type="text" name="" id="" placeholder='Enter list title' style={{outline:'none', font:'inherit', padding:'4px'}} />
                <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                    <span className='btn' onClick={handleList}>Add Card</span>
                    <span onClick={()=>setAddList(false)} style={{cursor:'pointer'}}>X</span>
                </div>
            </div>
            }
            </div>
            
          </div>
        </div>
      </DndProvider>
    </stateContext.Provider>
  );
}

export default App;

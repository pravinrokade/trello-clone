import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import { stateContext } from './App';
import Card from './Card';
import { useDrop } from 'react-dnd';

function Boards({title}) {

    const [addCard, setAddCard] = useState(false);
    const textRef = useRef(null);
    const {state, dispatch} = useContext(stateContext)

    const handleAddCard = () => {
        if (textRef.current.value.trim() === '') return;
        dispatch({
            type:'add', 
            payload:{
                value:textRef.current.value, 
                title:title
            }
        });
        setAddCard(false);
        textRef.current.value = '';
    }

    const [, dropRef] = useDrop(()=>({
            accept : "Card",
            drop : (item, monitor)=> {
                if (monitor.didDrop()) return;
                dispatch({
                    type : "Drag-Drop",
                    payload : {
                        fromBoard : item.title ,
                        toBoard : title ,
                        fromIndex : item.ind,
                        toIndex : state[title].length
                    }
                })
            }
        }))
    

  return (
    <div ref={dropRef} className='board'>
        <p style={{color:'RGB(23, 43, 77)', fontWeight:'600'}}>{title}</p>
        {
            state[title].map((val, ind)=>(
                // <p className='card-div' key={ind}>{val}</p>
                <Card key={ind} val={val} title={title} ind={ind} />
            ))
        }
        {
            addCard?
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <textarea ref={textRef} placeholder='Enter a title for this card' style={{outline:'none', font:'inherit', padding:'4px'}}></textarea>
                <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                    <span className='btn' onClick={handleAddCard}>Add Card</span>
                    <span onClick={()=>setAddCard(false)} style={{cursor:'pointer'}}>X</span>
                </div>
            </div> :
            <p className='addCard' onClick={()=>{setAddCard(true)}} >+ Add Another Card</p>
        }
    </div>
        
  )
}

export default Boards
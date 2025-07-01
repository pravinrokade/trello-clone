import React, {useContext, useState} from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { stateContext } from './App';
import './App.css'

function Card({val, title, ind}) {

    const {state, dispatch} = useContext(stateContext)
    
    const [, dragRef] = useDrag(()=>({
        type : "Card",
        item: { title, ind }
    }))

    const [, dropRef] = useDrop(()=>({
        accept : "Card",
        drop : (item)=> {
            dispatch({
                type : "Drag-Drop",
                payload : {
                    fromBoard : item.title ,
                    toBoard : title ,
                    fromIndex : item.ind,
                    toIndex : ind
                }
            })
        }
    }))

    const [editCard, setEditCard] = useState(true);
    const [editText, setEditText] = useState(val);
    
    const handleEditCard = () => {
            if (editText.trim() === '') return;
            dispatch({
                type:'edit', 
                payload:{
                    value:editText, 
                    title:title,
                    index:ind
                }
            });
            setEditCard(true);
    }

  return (
    <div ref={dropRef} className='card-wrapper-div'>

        {editCard? 
        <div ref={dragRef} className='card-div'>
            <p className='card-text'>{val}</p>
            <div className='icons'>
                <p className='edit-btn' onClick={()=>setEditCard(false)}>✎</p>
                <p className='delete-btn' onClick={()=>dispatch({type : 'delete', payload : {index : ind, title : title } })}>🗑️</p>
            </div>
        </div> :
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <textarea value={editText} onChange={(e)=>setEditText(e.target.value)} style={{outline:'none', font:'inherit', padding:'4px'}}></textarea>
                <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                    <span className='btn' onClick={handleEditCard}>Save Changes</span>
                    <span onClick={()=>setEditCard(true)} style={{cursor:'pointer'}}>X</span>
                </div>
            </div>}

    </div>
  )
}

export default Card
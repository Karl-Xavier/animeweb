import { MagnifyingGlass } from 'phosphor-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ handleExpand }) {
    const navigate = useNavigate()

    const [ genre, setGenre ] = useState('')
    
    function handleSearch(e){
      e.preventDefault()
        if(genre){
            navigate(`/genre/${genre}`)
        }
    }

    function allSearchFuncton(e){
      handleSearch(e)
    }

  return (
    <form onSubmit={allSearchFuncton} style={styles.searchbar}>
      <input style={styles.input} type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder='Search By Genre e.g action' onClick={handleExpand}/>
      <button style={styles.searchBtn} type='submit'><MagnifyingGlass weight='bold' size={24}/></button>
    </form>
  )
}

const styles = {
 searchbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px',
    background: 'rgba(255, 255, 255, 0.7)',
    color: '#242424',
    padding: '5px',
    borderRadius: '5px'
 },
 input: {
    width: '100%',
    outline: 'none',
    background: 'transparent'
 },
 searchBtn: {
    outline: 'none'
 },
}
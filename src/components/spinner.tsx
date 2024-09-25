import React, { FC } from 'react'
import loading from '../assets/Spinner.gif';
const Spinner : FC= () => {
    return (
      <div className='text-center'>
        <img className='my-3' src={loading} alt='loading' style={{height:"1rem"}}/>
      </div>
    )
}

export default Spinner;
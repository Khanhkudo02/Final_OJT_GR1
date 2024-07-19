import React from 'react'

const PositionManagement = () => {
  return (
    <main>
      <div>
      <h2>Account Info</h2>
      <p>This is the account info page.</p>
    </div>
        <section className='position-info'>
            <div className='position-view'></div>
            <div className='position-create'></div>
            <div className='position-edit'></div>
            <div className='position-delete'></div>
        </section>
    </main>
  )
}

export default PositionManagement
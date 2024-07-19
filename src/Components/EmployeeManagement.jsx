import React from 'react'

const EmployeeManagement = () => {
  return (
    <main>
      <div>
      <h2>lalalallala</h2>
      <p>This is the account info page.</p>
    </div>
      <section className='employee-profile'>
        <div className="employee-view"></div>
        <div className="employee-create"></div>
        <div className="employee-edit"></div>
        <div className="employee-export-profile"></div>
        <div className="employee-export-cv"></div>
      </section>
      <section className='employee-project'>
        <div className='employee-assign'></div>
        <div className='employee-project-list'></div>
        <div className='employee-sendemail'></div>

      </section>
    </main>
  );
}

export default EmployeeManagement
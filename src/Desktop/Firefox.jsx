import React from 'react'

const Firefox = () => {
  return (
    <div>
        <div className="firefox">
           <div className="firefox-header">
                <div className="header-icons">
                    <div className="header-icon"> &larr</div>
                    <div className="header-icon"> &rarr</div>
                    <div className="btn btn-default btn-sm"><i className='material-icon'>refresh</i></div> 
                    <div className="home-icon">Home</div>
                </div>

                <div className="url-bar-section">
                    <div className="url-bar-icons">
                        <div className="lock-icon"></div>
                        <div className="url-bar">
                            <input type="text" />
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default Firefox
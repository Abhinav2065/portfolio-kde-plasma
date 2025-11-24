import React, { useState } from 'react'

const Firefox = () => {

    const [url, setUrl] = useState("https://google.com"); // Initial Url (the page that shows up when u first open the browser)


    const handleUrlChange = (newUrl) => {
        setUrl(newUrl);
    }


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
                            <input type="text" onSubmit={handleUrlChange}/>
                        </div>
                    </div>
                </div>

                <div className="firefox-header-icons-left-side">
                    <div className="hamberg-icon"></div>
                    <div className="cross">x</div>
                </div>
            </div> 

            <div className="sidebar">
                <div className="sidebar-icons">
                    <div className="sidebar-icon">
                        Home Icon 
                    </div>

                    {/* Other Icons go here, I will add a loop for the tabs on the sidebar later */}
                </div>
            </div>

            <div className="main-page">
                <iframe src={url} frameborder="0"></iframe> {/* This loads the website */}
            </div>
        </div>
    </div>
  )
}

export default Firefox
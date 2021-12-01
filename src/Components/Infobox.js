import React from 'react'
import './Infobox.css'

function Infobox({title,active,isRed,cases,total,...props}) {
    return (
        <div className="infobox" onClick={props.onClick}>
            <div className="infobox_container">
                <p className="infobox_title">{title}</p>
                <p className="infobox_cases">{cases}</p>
                <p className="infobox_total">{total} Total</p>
            </div>
        </div>
    )
}

export default Infobox

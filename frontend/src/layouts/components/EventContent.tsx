import React, { useState } from 'react'


interface eventContentI{
    description: string,
}

export default function EventContent({description}:eventContentI) {

    const [toggle, setToggle] = useState(false);

    return (
        <>

            {toggle ? description : description.slice(0, 150)}
            {description.length > 150 &&
                <button className="font-semibold pl-2" onClick={(e) => setToggle(!toggle)}>{toggle ? 'Read less' : 'Read more'}</button>}

        </>
    )
}

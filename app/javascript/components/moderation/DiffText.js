import React from 'react';

function DiffText({ diffArray }) {
    return (
        <>
            {diffArray.map((word, index) => (
                <span key={index} className={`diff-${word.type}`}>
                    {word.text}
                    {index < diffArray.length - 1 && " "}
                </span>
            ))}
        </>
    )
}

export default DiffText;
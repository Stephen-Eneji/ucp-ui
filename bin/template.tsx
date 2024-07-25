import React from "react";
import ReactRender from "../../helper-components/react-wrapper";
import '@/styles/sass/{the-name-passed}.scss'

ReactRender(() => {
  return (
    <div className="ucp-{the-name-passed}">
             Hello this is {the-name-passed}
    </div>
  )
})

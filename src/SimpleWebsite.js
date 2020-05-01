import img1 from './images/piechart1.png'
import gif2 from './images/image-ANIMATION.gif'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
export default class SimpleWebsite extends Component {

// renders a simple website with the charts and graphs created in Excel

render() {
    return (
        <section id = "simpleWebsite">
        <h1> This is a simple website</h1>
        <p> I can display images that were created previously on this site, and explain things!</p>
        <img src={img1} alt="piechart2005" />
        <p> In 2005, large parts of the UK power capacity was generated via coal and gas plants. Over time, change happened, with more solar and wind plants popping up. By 2020, coal was completely eliminated.</p>
        <img src={gif2} alt="OverTime Gif" />
        </section>
        
    )
}
}
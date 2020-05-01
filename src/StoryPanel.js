import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Observer from '@researchgate/react-intersection-observer';
import ReactHtmlParser from 'react-html-parser';

export default class StoryPanel extends Component {
  //a storypanel is visible whenit enters the viewport until another enters.
  m_actionFilter = null
  state = {
    visible: true,
    id: this.props.id,
    anchorname: this.props.anchorname,
    paragraphs: []
  };

  headerHandleChange = event => {

    if (event.isIntersecting && this.props.id !== this.props.activeID) {  //this element scrolled into view
      this.props.app.setActiveID(this.props.id, this.props.typeContent, this.props.imgUrl)
    }

    this.setState({
      visible: this.props.id === this.props.activeID

    });
  };

  componentDidMount() {
    var res = [];
    for (var i = 0; i < this.props.paragraphs.length; i++) {
      res.push(
        { "text": this.props.paragraphs[i].props.content.text, "code": this.props.paragraphs[i].props.content.code, "image": this.props.paragraphs[i].props.content.image, "title": this.props.paragraphs[i].props.content.title, "filter": this.props.paragraphs[i].props.actionFilter }
      )



      this.setState({
        paragraphs: res
      })
    }
  }
  render() {

    return (
      <section id={"section_" + this.state.id} className={`storyPanelSection ${this.state.visible && this.state.id === this.props.activeID ? 'activePanel' : 'inactivePanel'}`} >
        <Observer onChange={this.headerHandleChange}
          threshold={1}
        >

          <h1 id={this.props.anchorname} className={`sticky sectiontitle`}>{this.props.title}</h1>
        </Observer>

        <div id={this.props.anchorname + "_id"} className="panelcontent">
          {this.state.paragraphs.map(
            (paragraph, i) =>
              <StoryParagraph
                key={this.state.anchorname + "_id_p" + i}
                id={this.state.anchorname + "_id_p" + i}
                title={paragraph.title}
                paragraph={paragraph.text}
                code={paragraph.code}
                image={paragraph.image}
                actionFilter={paragraph.filter}

              />
          )}
        </div>

      </section>

    )
  }
}

class StoryParagraph extends Component {


  m_firedAction = false
  m_statusChanged = false
  m_filterArray = ["any", []]
  state = {
    id: this.props.id,
    visible: false
  }

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  handleScroll(event) {
    //if the element is visible we check where it is on the screen, and highlight it when it enters a threshold, dehighlight when it exits.
    if (this.state.visible) {
      var topOffset = ReactDOM.findDOMNode(this).getBoundingClientRect().top
      var bottomOffset = ReactDOM.findDOMNode(this).getBoundingClientRect().bottom
      if (!this.m_firedAction) {
        if (this.state.highlighted) {
          if (this.props.actionFilter) { //if this has any actions supplied

            this.props.actionFilter.action(this.props.actionFilter.objects, true)
            //   this.m_mapFunctions.setFilterTypeString(this.m_filterArray)
            //TODO HERE this.props.actionFilter.action
          }
          this.m_firedAction = true;
        } else {
          if (this.props.actionFilter) {

            this.props.actionFilter.action(null, true)
            // this.m_mapFunctions.showAllTypes()
            this.m_firedAction = true;
          }
        }
      }
      if ((topOffset > 150 && topOffset < 300) || (topOffset < 150 && topOffset > 0 && bottomOffset > 300)) {
        //if this paragraph has anactionFilter to it, apply it!
        if (!this.state.highlighted) {
          this.setState({
            highlighted: true
          })
          this.m_firedAction = false
        }


      } else {

        if (this.state.highlighted) {
          //visible should update...
          this.setState({
            highlighted: false
          })
          //deactivate filter if thereisonw
          this.m_firedAction = false
        }

      }
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    //construct the filter if there is one
    /*if (this.props.actionFilter) {
      this.m_filterArray = ["any"]
      //create the filter syntax fromthe actionFilter provided
      for (var i = 0; i < this.props.actionFilter.types.length; i++) {
        this.m_filterArray.push(["==", ["get", "type"], this.props.actionFilter.types[i]])
      }
      
     
    }*/
  }

  //gets called when the element intersects with Observer
  paragraphChange = event => {
    this.setState({
      visible: event.isIntersecting
    })

  }

  render() {
    return (
      <Observer
        onChange={this.paragraphChange}
      >
        <div> {this.props.title ?
          <h3>{this.props.title}</h3>
          :
          ""}
          <div
            className={`scrolltext ${this.state.highlighted ? "active" : ""}`}
            id={this.props.id}>
            {this.props.image ?
              <div className="inTextImage">
                <img src={this.props.image} alt={this.props.image} />
              </div>
              :
              ""}
            {this.props.code ? <code className="codeSection">{this.props.code}</code> : ""}
            <p>
              {ReactHtmlParser(this.props.paragraph)}
            </p>

          </div>
        </div>
      </Observer>
    )
  }
}
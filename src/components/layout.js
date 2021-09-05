import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useWindowDimensions from '../components/hooks/windowDimensions';

const Layout = ({ isHomePage, children }) => {

  const { height, width } = useWindowDimensions();
  const isBrowser = () => typeof window !== "undefined"
  const [menuState, setMenuState] = useState({ show: false });
  const [tabIndex, setTabIndex] = useState(0);

  const handleMenu = () => {
    if (menuState.show === true) {
      setMenuState({ show: false });
    }
    else {
      setMenuState({ show: true });
    }
  };

  function formatPath(str) {
    str = str.replace(/[^a-zA-Z0-9]/g, "");
    str = str.toLowerCase();
    return str;
  }

  //set active menu link via url path 
  //change this to only add listener on post links later
  let path;
  if (isBrowser()) {
    path = formatPath(window.location.pathname);

    document.body.addEventListener('click', () => {
      requestAnimationFrame(() => {
        // path !== window.location.pathname && console.log(`url->${formatPath(window.location.pathname)}`);
        path = formatPath(window.location.pathname);
      });
    }, true);
  }

  const data = useStaticQuery(graphql`
    query LayoutQueryAndAllPosts {

      info: wp {
        generalSettings {
          title
          description
        }
      }
      posts: allWpPost(
              sort: { fields: [date], order: ASC }              
            ) {
              nodes {
                excerpt
                uri
                date(formatString: "MMMM DD, YYYY")
                title
                excerpt
                tags {
                  nodes {            
                    name
                  }
                }     
              }
            }
    }
  `)
  const posts = data.posts.nodes;
  const messages = {
    welcome: "<span class='message-entry'>One fact site to rule them all, One fact site to find them, One fact site to bring them all and on the interwebs bind them</span>.<br><br>May this site serve as your pocket guide to all those precious Lord of the Rings facts that no one asked you to share on movie night.. <b>Study them</b>. <b>Know them</b>.<br><br>",
    team: "Looking to join the cause and add a fact? Shoot me an email or drop a comment. Contributors will be added to a special team page!"
  }

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <div className="global-header">
        <div className="header-logo">
          <Link to="/" onClick={() => { menuState.show && setMenuState({ show: false }) }}>Lord of the Facts</Link>
        </div>

        {width < 1025 &&
          <div className={"menu-control " + (menuState.show ? "change" : "")} onClick={() => { handleMenu() }}>
            <div className={"bar bar1"}></div>
            <div className={"bar bar2"}></div>
            <div className={"bar bar3"}></div>
          </div>
        }

        {width >= 1025 ?
          //hide collapsible menu on desktop
          <React.Fragment>
            <div className="timeline-link-wrapper">
              <Link className="timeline-link" to={'/timelines'} onClick={() => { setMenuState({ show: false }) }}>
                Movie Timelines
              </Link>
            </div>
            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
              <TabList>
                <Tab>Welcome!</Tab>
                <Tab>Facts</Tab>
                {/* <Tab>Team</Tab> */}
              </TabList>

              <TabPanel>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.welcome }}></p>
                <p className="message-text">Check out the <Link to={'/timelines'} onClick={() => { setMenuState({ show: false }) }} className='message-link'>Movie Timeline</Link> to follow along and know exactly when Aragorn breaks his toes and exactly how many toes he broke! Along the way you'll also make everyone around you sick with disgust..you're welcome!</p>
              </TabPanel>
              <TabPanel>
                <ul className="desktop-menu">
                  {posts.map((post, i) => {
                    return (
                      <li key={i}>
                        <p className={path === formatPath(post.title) ? "factNum active-factNum" : "factNum"}>{post.tags.nodes[0].name}.</p>
                        <Link to={post.uri}>{post.title}</Link>
                      </li>
                    )
                  })}
                </ul>
              </TabPanel>
              {/* <TabPanel>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.team }}></p>
                <form className="contact-form" method="post" action="">
                  <label>
                    Email
                    <input type="email" name="email" />
                  </label>
                  <label>
                    Name
                    <input type="text" name="name" />
                  </label>
                  <label>
                    Message
                    <textarea type="text" style={{ width: "100%", height: "160px", resize: "none" }} name="message" />
                  </label>
                  <button type="submit">Send</button>
                </form>
              </TabPanel> */}
            </Tabs>
            <div style={{ color: "white", display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Link to={'https://www.buymeacoffee.com/andrewbrown'} target="_blank" title="Buy me a pint!" className="beer-link">🍺</Link>
                {/* <p style={{ margin: "4px 0 0 0", fontSize: ".8em" }}>Buy me a pint!</p> */}
              </div>
            </div>
          </React.Fragment>

          :
          menuState.show &&
          <div className="menu">
            <div className="timeline-link-wrapper">
              <Link className="timeline-link" to={'/timelines'} onClick={() => { setMenuState({ show: false }) }}>
                Movie Timelines
              </Link>
            </div>

            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
              <TabList>
                <Tab>Welcome!</Tab>
                <Tab>Facts</Tab>
                {/* <Tab>Team</Tab> */}
              </TabList>

              <TabPanel>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.welcome }}></p>
                <p className="message-text">Check out the <Link to={'/timelines'} onClick={() => { setMenuState({ show: false }) }} className='message-link'>Movie Timeline</Link> to follow along and know exactly when Aragorn breaks his toes and exactly how many toes he broke! Along the way you'll also make everyone around you sick with disgust..you're welcome!</p>
              </TabPanel>
              <TabPanel>
                <ul>
                  {posts.map((post, i) => {
                    return (
                      <li key={i} className="mobile-menu-fact">
                        <p className={path === formatPath(post.title) ? "factNum active-factNum" : "factNum"}>{post.tags.nodes[0].name}.</p>
                        <Link onClick={() => { setMenuState({ show: false }) }} to={post.uri}>{post.title}</Link>
                      </li>
                    )
                  })}
                </ul>
              </TabPanel>
              {/* <TabPanel>
                <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.team }}></p>
                <form className="contact-form" method="post" action="">
                  <input type="email" name="email" placeholder="Email" />
                  <input type="text" name="name" placeholder="Name" />
                  <textarea type="text" style={{ width: "100%", height: "160px", resize: "none" }} name="message" placeholder="Message" />
                  <button type="submit">Send</button>
                </form>
              </TabPanel> */}
            </Tabs>
            <div className="mobile-menu-bottom">
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Link to={'https://www.buymeacoffee.com/andrewbrown'} target="_blank" title="Buy me a pint!" className="beer-link">🍺</Link>
                <p style={{ margin: "0", fontSize: ".8em" }}>Buy me a pint!</p>
              </div>
            </div>
          </div>
        }
      </div>
      <main>{children}</main>
    </div>
  )
}

export default Layout
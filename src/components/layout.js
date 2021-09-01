import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useWindowDimensions from '../components/hooks/windowDimensions';
import useWindowLocation from '../components/hooks/windowLocation';
import lotfRing from '../../content/assets/lotf-ring.png'

const Layout = ({ isHomePage, children }) => {

  const { height, width } = useWindowDimensions();
  // const { path } = useWindowLocation();
  // const [path, setPath] = useState(window.location.pathname);
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

  // console.log('data: ', data);
  // console.log(`width:${width}, height:${height}`);

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
                View Timelines
              </Link>
            </div>
            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
              <TabList>
                <Tab>Welcome!</Tab>
                <Tab>Facts</Tab>
                <Tab>Help</Tab>
              </TabList>

              <TabPanel>
                <p style={{ color: "white" }}>Welcome to Lord of the Facts! All them good facts about your favorite hairy feet people.</p>
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
              <TabPanel>
                <p style={{ color: "white" }}>I need help.</p>
              </TabPanel>
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
                View Timelines
              </Link>
            </div>

            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
              <TabList>
                <Tab>Welcome!</Tab>
                <Tab>Facts</Tab>
                <Tab>Help</Tab>
              </TabList>

              <TabPanel>
                <p style={{ color: "white" }}>Welcome to Lord of the Facts! All them good facts about your favorite hairy feet people.</p>
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
              <TabPanel>
                <p style={{ color: "white" }}>I need help.</p>
              </TabPanel>
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
      {/* <header className="global-header">
        {isHomePage ? (
          <h1 className="main-heading">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
      </header> */}

      <main>{children}</main>

      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` `}
        And <a href="https://wordpress.org/">WordPress</a>
      </footer> */}
    </div>
  )
}

export default Layout
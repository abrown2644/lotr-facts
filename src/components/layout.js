import React, { useState, ReactFragment } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
// import parse from "html-react-parser"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useWindowDimensions from '../components/hooks/windowDimensions';

const Layout = ({ isHomePage, children }) => {

  const { height, width } = useWindowDimensions();
  const [menuState, setMenuState] = useState({ show: false });

  const handleMenu = () => {
    if (menuState.show === true) {
      setMenuState({ show: false });
    }
    else {
      setMenuState({ show: true });
    }
  };

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
          <Link to="/" onClick={() => { menuState.show && setMenuState({ show: false }) }}>Lord of The Facts</Link>
        </div>
        {width > 1025 ?
          //hide collapsible menu controls on desktop  
          <React.Fragment></React.Fragment>// nada
          :
          <div className={"menu-control " + (menuState.show ? "change" : "")} onClick={() => { handleMenu() }}>
            <div className={"bar bar1"}></div>
            <div className={"bar bar2"}></div>
            <div className={"bar bar3"}></div>
          </div>
        }

        {width > 1025 ?
          //hide collapsible menu on desktop
          <React.Fragment>
            <Tabs>
              <TabList>
                <Tab>Welcome!</Tab>
                <Tab>Facts</Tab>
                <Tab>Why?</Tab>
              </TabList>

              <TabPanel>
                <h2>Welcome</h2>
              </TabPanel>
              <TabPanel>
                <ul className="desktop-menu">
                  {posts.map(post => {
                    return (
                      <li>
                        <p className="factNum">{post.tags.nodes[0].name}</p>
                        <Link to={post.uri}>{post.title}</Link>
                      </li>
                    )
                  })}
                </ul>
              </TabPanel>
              <TabPanel>
                <p style={{ color: "white" }}>Because I spent 5 minutes searching for a site that had LOTS of Lord of The Rings facts without any ads.. I couldn't find one.</p>
              </TabPanel>
            </Tabs>
            <div style={{ color: "white", display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Link to={'https://www.buymeacoffee.com/andrewbrown'} target="_blank" className="beer-link">🍺</Link>
                <div>Buy me a beer</div>
              </div>
            </div>
          </React.Fragment>

          :
          menuState.show &&
          <div className="menu">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p style={{ color: "white", textDecoration: "underline" }}>Fact Index</p>
            </div>
            <ul>
              {posts.map(post => {
                return (
                  <li>
                    <p className="factNum">{post.tags.nodes[0].name}</p>
                    <Link to={post.uri}>{post.title}</Link>
                  </li>
                )
              })}
            </ul>
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
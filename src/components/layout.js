import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
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
    path = window.location.pathname;

    document.body.addEventListener('click', () => {
      requestAnimationFrame(() => {
        // path !== window.location.pathname && console.log(`url->${formatPath(window.location.pathname)}`);
        path = window.location.pathname;
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
    posts: allWpPost(sort: {fields: [date], order: ASC}) {
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
        featuredImage {
          node {
            altText
            localFile {
              childImageSharp {
                fixed(width: 55, height: 55) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
  `)
  const posts = data.posts.nodes;


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
                <Tab>Facts</Tab>
              </TabList>

              <TabPanel>
                <ul className="desktop-menu">
                  {posts.map((post, i) => {
                    const featuredImage = {
                      fixed: post.featuredImage?.node?.localFile?.childImageSharp?.fixed,
                      alt: post.featuredImage?.node?.alt || ``,
                    }
                    return (
                      <li key={i} className={path === post.uri ? "factNum active-factNum" : "factNum"} onClick={() => { setMenuState({ show: false }) }}>
                        <Link to={post.uri}>
                          <p>{post.tags.nodes[0].name}.</p>
                          <Image
                            className="fact-image"
                            fixed={featuredImage.fixed}
                            alt={featuredImage.alt}
                            style={{ marginRight: "8px", borderRadius: "50%" }}
                          />
                          {post.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
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
                Movie Timelines
              </Link>
            </div>

            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
              <TabList>
                <Tab>Facts</Tab>
              </TabList>

              <TabPanel>
                <ul>
                  {posts.map((post, i) => {
                    const featuredImage = {
                      fixed: post.featuredImage?.node?.localFile?.childImageSharp?.fixed,
                      alt: post.featuredImage?.node?.alt || ``,
                    }
                    return (
                      <li key={i} className={path === post.uri ? "factNum active-factNum" : "factNum"} onClick={() => { setMenuState({ show: false }) }}>
                        <Link to={post.uri}>
                          <p>{post.tags.nodes[0].name}.</p>
                          <Image
                            className="fact-image"
                            fixed={featuredImage.fixed}
                            alt={featuredImage.alt}
                            style={{ marginRight: "8px", borderRadius: "50%" }}
                          />
                          {post.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
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
      <main>{children}</main>
    </div>
  )
}

export default Layout